/*
    CHECKOUT SERVICE SERA EL INTERMEDIARIO Y QUIEN AL GENERARARSE UNA COMPRA TRABAJA SOBRE EL STOCK, SOBRE LA MODIFICACION DEL CART, 
    GENERACION DE TICKET, ETC
*/


import { CartsService } from "./carts.service.js";
import { TicketsRepositories } from "../repositories/ticket-repositories.js";
import { UsersService } from "./users.service.js";
import { MailingService } from "./mailing.service.js";
import handlebars from 'handlebars';
import fs from 'fs'
import { transformDate } from "../utils/hour.js";
import { CartsServiceError, ProductsServiceError, ProductDTOERROR, CheckoutsServiceError, CartDTOERROR, TicketDTOERROR } from './errors.service.js'
import { ProductsService } from "./products.service.js";


const productsService = new ProductsService()
const cartsService = new CartsService()
const usersService = new UsersService()
const ticketsRepository = new TicketsRepositories()



export class CheckoutService {
  
  async cartCheckout({userEmail,cartId}) {
   try{
      //Paso 1: Validamos datos.
      //Paso 2: comprobamos que perenezca a ese userEmail para que no cuakquiera pueda hacer checkpt sobre ese caroo
      //Paso 3 Pedimos el carro al servicio de carros y obtenemos sus productosDTO.

      //Recorremos con for of toda la lista del carro y miramos si tiene stock o no, de acuerdo a eso lo meto en una lista u otra
      //COn la lista de los que hay en stock hago calculo del total, descuento el stock
      //Pido al repositorio de tickets que genere el ticket a nombre del userEmail
      //Al id del ticket lo utilizo para referencia del pago de mercado pago.
      //Pido al repo de tickes que haga update al ticket y le meta el linck de mercado pago al ticket.
      //Devuelvo todo esto


      //Hago el checkout del carro para y tomo la informacion para llenar el ticket.
      const checkoutCartInfo = await this.cartCheckoutById({cartId:cartId})
      
      //ACA VENDRIA EL PROCESO DE PAGO Y OBTENCION DEL LINCK DE PAGO

      //ARMO CON TODA LA DATA EL TICKET
      const createdTicket = await ticketsRepository.createTicket({
        purchaser:userEmail,
        detailsList: checkoutCartInfo.productsInStock
      })
      

      //Hago el envio de email:
      MailingService.sendMail(JSON.stringify(createdTicket),userEmail,'Aca estan los datos de tu compra !!')
      

      //Aca hay que devolver el ticket.
      return {
        message: `Se genero el ticket ${createdTicket.code} para su compra. Ya esta en condiciones de pagarla. ENviamos un mail a tu casilla de correo !`,
        ticket: createdTicket,
        OutOfStock : checkoutCartInfo.OutOfStock
      }

   }catch(error){
    //console.log(error)
    if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR || error instanceof CartsServiceError || error instanceof CartDTOERROR || error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
    else throw new CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|CheckoutsService.checkoutCarById|','Error interno del servidor...')
 }
    
  }

  
  async cartCheckoutById({cartId}) {
    //Toma un carro, separa los productos que hay en stock de los que no hay y arma 2 listas.
    //Finalmente limpia el carro.
    /*Devuelve un objeto: {
              productsInStock:[{productTitle,requiredQuantity,img,unitPrice,subTotalPrice}],
              productOutOfStock:[{productTitle,requiredQuantity,img,unitPrice,subTotalPrice}],
              cart: cartVacio
    }}
        Todo esto se usara para la respuesta y armar el ticket          
    
    */
   try{
      const searchedCart = await cartsService.getCartById(cartId)
      
      if (searchedCart.countProducts<1) throw new CheckoutsServiceError(CheckoutsServiceError.CART_WITHOUT_PRODUCTS,'|CheckoutsService.cartCheckoutById|','Se intenta hacer checkout sobre un carro vacio...')

      const productsInStock = []
      const productsOutOfStock = []
      
      //Recorremos los productos del carro y aprovecho que sus dto traen su cantindad de stock actual
      let requiredProductQuantity
      let currentProductInfo
      let nuevoStock
    
      for (let item of searchedCart.products) {
       // console.log('iteraciones: ', searchedCart.products.length)
        requiredProductQuantity = item.quantity
        currentProductInfo = await productsService.getProductById(item.product.productId)
          if (requiredProductQuantity <= currentProductInfo.stock) {
          //Agrego el producto a la lista para generar el ticket.
          productsInStock.push({
            productTitle: item.product.title,
            requiredQuantity: requiredProductQuantity,
            img: item.product.img,
            unitPrice: item.product.price,
            subtotalPrice: item.subtotal
          })
          //Descuento el stock
          nuevoStock = currentProductInfo.stock - requiredProductQuantity
          //console.log('Nuevo stock',currentProductInfo.productId,'dddff',currentProductInfo.stock, '=> ',nuevoStock)
          await productsService.updateProductStock(currentProductInfo.productId,nuevoStock)
        }
        
        else{
            //Agrego el producto a la lista de productos sin stock para modo informativo..
          productsOutOfStock.push({
            productTitle: item.product.title,
            requiredQuantity: requiredProductQuantity,
            img: item.product.img,
            unitPrice: item.product.price,
            subtotalPrice: item.subtotal
          })
            
        }
      }

        const clearedCart = await cartsService.clearCart(cartId)

        return {
          productsInStock: productsInStock,
          productsOutOfStock: productsOutOfStock,
          cart: clearedCart
        }

      }
    
   catch(error){
    //console.log(error)
     if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR || error instanceof CartsServiceError || error instanceof CartDTOERROR || CheckoutsServiceError) throw error
      else throw new CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|CheckoutsService.checkoutCarById|','Error interno del servidor...')
   }
    
  }





  //Compra una o mas unidades de un producto en particular sin pasar por el carro.
  async checkoutProductBuy(productId, requiredQuantity, userId) {
    
    /*
    try {
      //revisa que haya stock, si hay sigue, si no , sale...
      //si compra entonces actualiza stock
      //genera y devuelve un ticket
      const searchedProduct = await productsRepository.getProductById(productId)
      //No hay stock salgo
      if (!searchedProduct.stock >= requiredQuantity) throw new CheckoutsServiceError(CheckoutService.NO_STOCK,'En este momento no tenemos stock del producto...')
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
      if (error instanceof (CheckoutsServiceError ||ProductsServiceError ||TicketsServiceError )) throw error
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

   */ 
  }


  async getTicketInfoByCode(ticketCode){
    /*
        
    try{
      const matchesList = await ticketsRepository.getTickets({code:ticketCode})
      //No existe ticket o sea no hay coincidencias salgo y envio error.
      if (matchesList.length < 1) throw new CheckoutService(CheckoutsServiceError.NO_TICKET,`No existe un ticket con ${ticketCode}...`)
      //console.log('TicketByCode: ',matchesList[0])
      //Dado que el ticket es unico cada codigo y tengo un array entonces devuelvo posicion cero.
      return matchesList[0]
    }catch(error){
      if (error instanceof (CheckoutsServiceError ||ProductsServiceError ||TicketsServiceError )) throw error
      else {
         throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||CheckoutService.getTicketInfoByCodey||...')
      }
    }
      */
  }

 
}
