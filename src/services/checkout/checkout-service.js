/*
    CHECKOUT SERVICE SERA EL INTERMEDIARIO Y QUIEN AL GENERARARSE UNA COMPRA TRABAJA SOBRE EL STOCK, SOBRE LA MODIFICACION DEL CART, 
    GENERACION DE TICKET, ETC
*/

import { ProductRepository } from "../../repositories/products.repositories.js";
import { CartRepository } from "../../repositories/cart.repositories.js";
import { TicketsRepositories } from "../../repositories/ticket.repositories.js";
import { UsersRepository } from "../../repositories/users.repositories.js";
import { MessagesService } from "../messages/messages-service.js";


const productsRepository = new ProductRepository();
const cartsRepository = new CartRepository();
const ticketsRepository = new TicketsRepositories();
const usersRepository = new UsersRepository();

export class CheckoutService {
  
  async checkOutCart(cartId) {
    const listToTicket = []; //LosProducto-cantidad que iran al ticket
    const listNoTicket = []; //Lo que no ira al ticket...
    try {
      //Obtengo el cart a procesar...
      const searchedCart = await cartsRepository.getCartById(cartId);

      //Antes que nada si el carro es un carro vacio entonces no se puede hacer el proceso y salimos..
      if (searchedCart.products.length < 1) {
        return {
          success: false,
          message: "El carro esta vacio, no se genera ticket,....",
        };
      }

      //Recorro cart.products y consulto stock y divido caminos.
      for (let item in searchedCart.products) {
        const requiredQuantity = searchedCart.products[item].quantity;
        //console.log('Products Id en este cart: ',productId, ' Quantity: ', requiredQuantity)

        //const product = await productsRepository.getProductById(productId)
        if (requiredQuantity <= searchedCart.products[item].product.stock) {
          //console.log('Restamos stock...')
          //Resto del stock
          await productsRepository.updateProductStock(
            searchedCart.products[item].product,
            searchedCart.products[item].product.stock - requiredQuantity
          );
          //Agrego al proceso de compra y lo borro del carro
          listToTicket.push({
            productTitle: searchedCart.products[item].product.title,
            requiredQuantity: requiredQuantity,
            img: searchedCart.products[item].product.img,
            unitPrice: searchedCart.products[item].product.price,
            //subtotalPrice: Number(searchedCart.products[item].product.price * requiredQuantity).toFixed(2),
          });
          await cartsRepository.deleteProductInCart(
            cartId,
            searchedCart.products[item].product.id
          );
        } else {
          //console.log('No agregamos a la compra, no restamos del stock...')
          //Junto en el array la lista de productos que no hay stock
          listNoTicket.push({
            productTitle: searchedCart.products[item].product.title,
            requiredQuantity: requiredQuantity,
            img: searchedCart.products[item].product.img,
            unitPrice: searchedCart.products[item].product.price,
            //subtotalPrice: Number(searchedCart.products[item].product.price * requiredQuantity).toFixed(2),
          });
        }
      }

      //Dado que al ticket le vamos a estampar el id del user dueño del cartId, buscamos el user por cartId.
      const users = await usersRepository.getUsers({ cart: cartId });
      //Ya que devuelve un array y sabemos que es solo uno...
      //console.log('user dueño del carro: ',users[0].id)

      //Ya tenemos la operacion hecha y ahora podemos generar el ticket
      const generatedTicket = await ticketsRepository.createTicket(users[0].id,listToTicket)

      if (!generatedTicket) {
        return {
          success: false,
          message: "Error en la creacion del ticket...",
        };
      } else
      {
        //Aca hay que generar texto html con la data del ticket para pasar a la plantilla
     '<p>Compra satisfactoria !!!!</p>'
        //Envio email de confirmacion de compra..
        MessagesService.sendMail('noimporta',users[0].email,'Compra realizad con exito !')


        return {
          success: true,
          message: "Creacion de ticket exitosa...",
          ticket: generatedTicket,
          noStock: listNoTicket,
        }
      }

        

    } catch {
      throw new Error(
        "Error al intentar checkout cart desde checkout Service..."
      );
    }
  }

  //Compra una o mas unidades de un producto en particular sin pasar por el carro.
  async checkoutProductBuy(productId, requiredQuantity, userId) {
    try {
      //revisa que haya stock, si hay sigue, si no , sale...
      //si compra entonces actualiza stock
      //genera un ticket
      const searchedProduct = await productsRepository.getProductById(productId)
      if (searchedProduct.stock >= requiredQuantity){
         //Actualizo stock restandole requiredQuantity
        await productsRepository.updateProductStock(productId,searchedProduct.stock-requiredQuantity)
        //Genero el ticket y en la lista envio producto y cantidad
        //Dado que al ticket le vamos a estampar el id del user dueño del cartId, buscamos el user por cartId.
       const generatedTicket = await ticketsRepository.createTicket(
          userId,
          [{
            productTitle: searchedProduct.title,
            requiredQuantity: requiredQuantity,
            img: searchedProduct.img,
            unitPrice: searchedProduct.price
           }]
        )
        if (!generatedTicket) {
          return {
            success: false,
            message: "Error en la creacion del ticket...",
          };
        } else
               //Aca hay que generar texto html con la data del ticket para pasar a la plantilla
        '<p>Compra satisfactoria !!!!</p>'
     //Envio email de confirmacion de compra..
        MessagesService.sendMail('noimporta',users[0].email,'Compra realizad con exito !')
          return {
            success: true,
            message: "Creacion de ticket exitosa...",
            ticket: generatedTicket,
            
          };

      }
      else{
        return {
          success: false,
          message: "No hay stock suficiente en este momento !!",
        }
      }
      
    } catch {
      throw new Error(
        "Error al intentar single checkout desde checkout Service..."
      );
    }
  }


  //Genera el texto html a partir de la lista del ticket

 
}
