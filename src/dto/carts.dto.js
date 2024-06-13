import { ProductDTO } from "./products.dto.js"



/*

ESTE DTO DEBE RECIBIR UN OBJETO CON LAS SIGUIENTES PROPIEDADES
id -> para construir el cartId
products: un array de objetos {product: , quantity}

*/
export class CartDTO{

    
    constructor(receivedCart){
      
        

            //console.log('Carro entrado a dto: ', receivedCart)
            this.id = receivedCart.id,
            this.products = receivedCart.products.map(item => ({
                product: new ProductDTO(item.product),
                quantity: item.quantity,
                subtotal: (Number(item.quantity) * Number(item.product.price)).toFixed(2)
            
            }))
            this.countProducts = receivedCart.products.reduce((accumulator,productItem)=>{
                return accumulator + productItem.quantity
            },0)
            this.cartAmount = receivedCart.products.reduce((accumulator,productItem)=>{
                return accumulator + productItem.product.price * productItem.quantity
            },0)
           

            

            
       
    }
}