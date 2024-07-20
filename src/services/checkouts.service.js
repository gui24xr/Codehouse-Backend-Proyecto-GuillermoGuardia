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

      //ARMO CON TODA LA DATA EL TICKET. Pero si Si la lista de productos en stock esta vacia entonces no vamos a generar compra ni ticket.
      if (checkoutCartInfo.productsInStock.length < 1) throw new CheckoutsServiceError(CheckoutsServiceError.PRODUCT_WITHOUT_STOCK,'CheckoutsService.cartCheckOut', 'NO hay productos en stock para comprar...')
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
              cart: cartConProductosYaBorrados
    }}
        Todo esto se usara para la respuesta y armar el ticket          
    
    */
   try{
      const searchedCart = await cartsService.getCartById(cartId)
      
      if (searchedCart.countProducts<1) throw new CheckoutsServiceError(CheckoutsServiceError.CART_WITHOUT_PRODUCTS,'|CheckoutsService.cartCheckoutById|','Se intenta hacer checkout sobre un carro vacio...')

      const productsInStock = []
      const productsOutOfStock = []
      
      //Recorremos los productos del carro y aprovecho que sus dto traen su cantidad de stock actual y discrimino lo que hay en stock de lo que no hay.
      //Agrupo los productos del carro en 2 listas. Una para los que hay stock y otra para los que no.
      let currentProductInfo
     
      for (let productInCart of searchedCart.products) {
        currentProductInfo = await productsService.getProductById(productInCart.product.productId)
          if (currentProductInfo.stock >= productInCart.quantity) {
            productsInStock.push(productInCart) //Agrego el producto a la lista para de stock de la cual luego extraere info para el ticketDetailInfo
            console.log('Nueva cantidad en stock debe ser: ', currentProductInfo.stock - productInCart.quantity)
            await productsService.updateProductStock(currentProductInfo.productId,currentProductInfo.stock - productInCart.quantity) //Descuento el stock
          }
          else{
            productsOutOfStock.push(productInCart) //Agrego el producto a la lista de productos sin stock para modo informativo..  
          }
      }

        //De la lista de productos en stock solo envio para el ticket la info que me interesa y la mapeo. 
        const ticketDetailInfo = productsInStock.map( item => ({
          //productId: item.product.productId, //En este caso me interesa el productID para mandar a quitar del carro
          productTitle: item.product.title,
          requiredQuantity: item.quantity,
          img: item.product.img,
          unitPrice: item.product.price,
          subtotalPrice: item.subtotal
        }))

        //De la lista de productos sin stock solo envio para el ticket la info que me interesa y la mapeo. 
        const listOfOutStockInfo = productsOutOfStock.map( item => ({
          productTitle: item.product.title,
          requiredQuantity: item.quantity,
          img: item.product.img,
          unitPrice: item.product.price,
          subtotalPrice: item.subtotal
        }))

        //Ahora quito del carro los productos comprados piiendoselo al servicio de carts. Armo la lista y envio a quitar los productos del carro.
        const listForDeleteFromCart = productsInStock.map( item => ({productId: item.product.productId, quantity: item.quantity}))
        //console.log('Lista para quitar del carro: ',listForDeleteFromCart)

        //for (let product of listForDeleteFromCart) await cartsService.deleteProductFromCart(cartId,product.productId)
        const updatedCart = await cartsService.deleteProductListFromCart(cartId,listForDeleteFromCart)


        return {
          productsInStock: ticketDetailInfo,
          productsOutOfStock: listOfOutStockInfo,
          cart: updatedCart
        }

      }
    
   catch(error){
    //console.log(error)
     if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR || error instanceof CartsServiceError || error instanceof CartDTOERROR || CheckoutsServiceError) throw error
      else throw new CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|CheckoutsService.checkoutCarById|','Error interno del servidor...')
   }
    
  }





  //Compra una o mas unidades de un producto en particular sin pasar por el carro.
  async checkoutSingleProduct({productId, quantity, userEmail}) {
    try{
      //1- Corroboro que el user no sea owner del producto, de serlo, sale error.
      //2. Corroboro stock, si hay stock, lo descuento y  voy para adelante, si no, lanzo error.
      //3- genero ticket y pago, envio la respuesta.
     
      const searchedProduct = await productsService.getProductById(productId)
      if (!searchedProduct) throw new CheckoutsServiceError(CheckoutsServiceError.PRODUCT_NO_EXIST,'|CheckoutsService.checkoutSingleProduct|','Se intenta comprar un producto que no existe....')
      if (searchedProduct.owner == userEmail) throw new CheckoutsServiceError(CheckoutsServiceError.OWNER_PRODUCT_USER,'|CheckoutsService.checkoutSingleProduct|','No se puede comprar productos propios...')
      if (searchedProduct.stock < Number(quantity)) throw new CheckoutsServiceError(CheckoutsServiceError.PRODUCT_WITHOUT_STOCK,'|CheckoutsService.checkoutSingleProduct|','En este momento no se cuenta con el stock para la compra...')

      //Se pasaron todas las validaciones, descontamos stock y generamos el ticket
      await productsService.updateProductStock(productId,Number(searchedProduct.stock)- Number(quantity))


      
      //ACA VENDRIA EL PROCESO DE PAGO Y OBTENCION DEL LINCK DE PAGO
  

      //ARMO CON TODA LA DATA EL TICKET
      const createdTicket = await ticketsRepository.createTicket({
        purchaser:userEmail,
        detailsList: [{
          productTitle: searchedProduct.title,
          requiredQuantity: quantity,
          img: searchedProduct.img,
          unitPrice: searchedProduct.price,
          subtotalPrice: Number(searchedProduct.price * quantity)
        }]
      })
      

      //Hago el envio de email:
      MailingService.sendMail(JSON.stringify(createdTicket),userEmail,'Aca estan los datos de tu compra !!')
      //Aca hay que devolver el ticket.
      return {
        message: `Se genero el ticket ${createdTicket.code} para su compra. Ya esta en condiciones de pagarla. ENviamos un mail a tu casilla de correo !`,
        ticket: createdTicket,
      }
   }catch(error){
    if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR || error instanceof CartsServiceError || error instanceof CartDTOERROR || error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
    else throw new CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|CheckoutsService.checkoutSingleProduct|','Error interno del servidor...')
 }
    
  }


  //Genera el texto html a partir de la lista del ticket
/*
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

*/

 
}
