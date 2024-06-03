import { ProductDTO } from "./products.dto.js"


export class CartDTO{

    
    constructor(receivedCart){
      
        if(process.env.database='mongo'){

            //console.log('Carro entrado a dto: ', receivedCart)
            this.id = receivedCart._id,
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
}