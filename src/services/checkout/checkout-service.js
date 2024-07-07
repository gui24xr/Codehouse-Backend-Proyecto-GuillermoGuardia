/*
    CHECKOUT SERVICE SERA EL INTERMEDIARIO Y QUIEN AL GENERARARSE UNA COMPRA TRABAJA SOBRE EL STOCK, SOBRE LA MODIFICACION DEL CART, 
    GENERACION DE TICKET, ETC
*/

import { ProductRepository } from "../../repositories/products.repositories.js";

import { CartsService } from "../carts.service.js";
import { TicketsRepositories } from "../../repositories/ticket.repositories.js";

import { UsersService } from "../users.service.js";
import { MessagesService } from "../messages.service.js";
import handlebars from 'handlebars';
import fs from 'fs'
import { transformDate } from "../../utils/hour.js";
import { CartsServiceError, ProductsServiceError,TicketsServiceError, InternalServerError, CheckoutServiceError } from "../errors/custom-errors.js";


const productsRepository = new ProductRepository()

const cartsService = new CartsService()
const ticketsRepository = new TicketsRepositories()

const usersService = new UsersService()

export class CheckoutService {
  
  async checkOutCart(cartId) {
    const listToTicket = []; //LosProducto-cantidad que iran al ticket
    const listNoTicket = []; //Lo que no ira al ticket...

    
    try {
      //Obtengo el cart a procesar...
      const searchedCart = await cartsService.getCartById(cartId);
      
       //Antes que nada si el carro es un carro vacio entonces no se puede hacer el proceso y salimos..
      if (searchedCart.products.length < 1)  throw new CheckoutService(CheckoutServiceError.NULL_CART,`El carrito ID ${cartId} esta vacio, imposible generar ticket...`)
      //Recorro cart.products y consulto stock y divido caminos.
      
      
      for (let item in searchedCart.products) {
        const requiredQuantity = searchedCart.products[item].quantity;
        if (requiredQuantity <= searchedCart.products[item].product.stock) {
          //console.log('Restamos stock...')
          //Resto del stock
          
          await productsRepository.updateProductStock(
            searchedCart.products[item].product,
            searchedCart.products[item].product.stock - requiredQuantity
          );
          console.log('Entro a checkut cart')  //Agrego al proceso de compra y lo borro del carro
          listToTicket.push({
            productTitle: searchedCart.products[item].product.title,
            requiredQuantity: requiredQuantity,
            img: searchedCart.products[item].product.img,
            unitPrice: searchedCart.products[item].product.price,
            //subtotalPrice: Number(searchedCart.products[item].product.price * requiredQuantity).toFixed(2),
          })
       
          //Borro el producto del carrito
          await cartsService.deleteProductFromCart(cartId,searchedCart.products[item].product._id)
       
        } else {
          //console.log('No agregamos a la compra, no restamos del stock...')
          //Junto en el array la lista de productos que no hay stock
          listNoTicket.push({
            productTitle: searchedCart.products[item].product.title,
            requiredQuantity: requiredQuantity,
            img: searchedCart.products[item].product.img,
            unitPrice: searchedCart.products[item].product.price,
          });
        }
      }

      

      //Dado que al ticket le vamos a estampar el id del user dueño del cartId, buscamos el user por cartId.
      const searchedUser = await usersService.getUserByCart(cartId)
      //Ya que devuelve un array y sabemos que es solo uno...
     //Ya tenemos la operacion hecha y ahora podemos generar el ticket
      const generatedTicket = await ticketsRepository.createTicket(searchedUser.userId,listToTicket)
  
     //Envio email de confirmacion de compra..
        await this.sendTicketMail(generatedTicket._id)
       
        return {
          ticket: generatedTicket,
          noStock: listNoTicket,
        }
              

    } catch {
      if ( error instanceof CartsServiceError ||  error instanceof CheckoutServiceError || error instanceof ProductsServiceError ||
        error instanceof TicketsServiceError) throw error
        else {
           throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||CheckoutService.checkoutCart||...')
        }
    }  
    
  }





  //Compra una o mas unidades de un producto en particular sin pasar por el carro.
  async checkoutProductBuy(productId, requiredQuantity, userId) {
    try {
      //revisa que haya stock, si hay sigue, si no , sale...
      //si compra entonces actualiza stock
      //genera y devuelve un ticket
      const searchedProduct = await productsRepository.getProductById(productId)
      //No hay stock salgo
      if (!searchedProduct.stock >= requiredQuantity) throw new CheckoutServiceError(CheckoutService.NO_STOCK,'En este momento no tenemos stock del producto...')
      //De haber stock, continuamos...
      //Actualizo stock restandole requiredQuantity
       await productsRepository.updateProductStock(productId,searchedProduct.stock,requiredQuantity)
      //Genero el ticket.
      const generatedTicket = await ticketsRepository.createTicket(
            userId,[{
            productTitle: searchedProduct.title,
            requiredQuantity: requiredQuantity,
            img: searchedProduct.img,
            unitPrice: searchedProduct.price
           }]
        )
        //Se envia el email de confirmacion
      await this.sendTicketMail(generatedTicket._id)
         
      return  generatedTicket
      
    }
    catch(error){
      if (error instanceof (CheckoutServiceError ||ProductsServiceError ||TicketsServiceError )) throw error
      else {
         throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||CheckoutService.checkoutProductBuy||...')
      }
    }
  }


  //Genera el texto html a partir de la lista del ticket

  async sendTicketMail(ticketId){
    //Recibe como parametro un ticketId y busca el ticket para generar el template con sus datos
    //Va a generar usando hbs la plantilla que sera enviada al salir ok la compra.
   try{

     
      const resultTicket = await ticketsRepository.getTicketById(ticketId)
      
      //Proceso los valores para enviar...
      const moment = transformDate(resultTicket.purchase_datetime);
      const valuesToRender = {
        detailsList: resultTicket.details,
        price: resultTicket.price.toFixed(1),
        transactionDate: moment.date,
        transactionHour: moment.hour,
        ticketCode: resultTicket.code,
      }

      const source = fs.readFileSync('./src/services/checkout/ticket_template.html', 'utf8');
      const template = handlebars.compile(source);
      const htmlForEmail = template(valuesToRender)


      // Guardar HTML generado en un archivo
      fs.writeFileSync('./ticket_generated.html', htmlForEmail, 'utf8');
      MessagesService.sendHtmlMail(resultTicket.purchaser.email,'Tu Compra se realizo con exito !',htmlForEmail)

    }catch(error){
      throw new Error('Error intentando enviar mail con ticket desde checkout service...')
    }

    
  }


  async getTicketInfoByCode(ticketCode){
        
    try{
      const matchesList = await ticketsRepository.getTickets({code:ticketCode})
      //No existe ticket o sea no hay coincidencias salgo y envio error.
      if (matchesList.length < 1) throw new CheckoutService(CheckoutServiceError.NO_TICKET,`No existe un ticket con ${ticketCode}...`)
      //console.log('TicketByCode: ',matchesList[0])
      //Dado que el ticket es unico cada codigo y tengo un array entonces devuelvo posicion cero.
      return matchesList[0]
    }catch(error){
      if (error instanceof (CheckoutServiceError ||ProductsServiceError ||TicketsServiceError )) throw error
      else {
         throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||CheckoutService.getTicketInfoByCodey||...')
      }
    }
  }

 
}
