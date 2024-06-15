import { CartsServiceError, CartDTOERROR } from "./errors.service.js"
import { CartRepository } from "../repositories/carts-repository.js"

/*Aca hacemos toda la logica de negocio usando nuestro repositories */
const cartRepository = new CartRepository()

export class CartsService {

    async createCart(){
        try{
            const newCart = await cartRepository.createCart()
            return newCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.createCart|')
        }
    }



    async getCartById(cartId){
        try {
            const searchedCart = await cartRepository.getCartById(cartId)
            return searchedCart
        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.getCartById|')
        }
    }


    async checkoutCartById(cartId){
        //Ya nos trae un dto de carts que tiene una lista de dto products
        try {
            const listToPreOrder = []; //LosProducto-cantidad que iran al ticket
            const listNoPreOrder = []; //Lo que no ira al ticket...
            const searchedCart = await cartRepository.getCartById(cartId)//Obtengo cartDTO
            //mi CartDTO trae info de los productos que tiene y el stock de los mismos x lo cual no hace falta comprobarstock.
            //Recorro searchedCart.products . En searchedCart.quantity tengo la cantidad requerida y subtotal precio*cantidad.
            // SearchedCart.products.product.stock el stock actual
            // SearchedCart.products.product.stock el stock actual
            // SearchedCart.products.product.price el precio unitario
            //Armo la lista para la preOrder, esto es quitar los que no hay stock.
            searchedCart.products.forEach(item =>{
                //Compruebo stock vs cantidad requerida
                if (item.quantity < item.product.stock) {
                    listToPreOrder.push(item)
                    //El descuento de stock lo va  ahacer el checkout service directamente.
                }
                else  listNoPreOrder.push(item)
                
            })
            return {
                listToPreOrder : listToPreOrder,
                listNoPreOrder : listNoPreOrder
            }
        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.getCartById|')
        }
    }


    async getProductsInCart(cartId){
        try {
            const searchedCart = await cartRepository.getCartById(cartId)
            return searchedCart.products

        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.getProductsInCart|')
        }
    }


    //Deveulve la cantidad de producto, si el producto no se encuentra devuelve cero, si no, la cantidad
    async getProductQuantityInCart(cartId,productId){
        try{
            const searchedCart = await cartRepository.getCartById(cartId)
            //COmo obtengo un dto y lo conoce lo busca
            const productPosition = searchedCart.products.findIndex(item => item.product.productId == productId)
            if (productPosition>=0){
                return searchedCart.products[productPosition].quantity
            }else{
                return 0
            }
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.getProductQuantityInCart|')
        }
    }
    

    async addProductInCart(cartId,productId,quantity){
        try {
          //La logica del negocio dice:
          //1-Si no existe el producto en el carro, lo agrego...
          //2- Si no conozco la cantidad deseada agrego 1, si no quantity
          //Si el producto esta en el carro sumo la cantidad quantity y si no conozco la cantidad le sumom 1 unidad
          //Deveulve el carro actualizado
          const productQuantityInCart = await this.getProductQuantityInCart(cartId,productId)
          if (productQuantityInCart < 1){
          const updatedCart = await cartRepository.addProductInCart(cartId,productId,quantity || 1)
          return updatedCart
          }
          else{
            const newQuantity = (productQuantityInCart + quantity) || (productQuantityInCart + 1)
            const updatedCart = await cartRepository.updateProductQuantityInCart(cartId,productId,newQuantity)
            return updatedCart
          }

        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.addProductInCart|')
        }
    }

    async deleteProductFromCart(cartId,productId){
        try{
            const updatedCart = await cartRepository.deleteProductFromCart(cartId,productId)
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.deleteProductFromCart|')
        }
    }
    
    async clearCart(cartId){
        try {
           const updatedCart = await cartRepository.clearCart(cartId)
           return updatedCart
          } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.clearCart|')
          }

   }

   async addProductListToCart(cartId,productList){
    //Es preferible enviar la data a la capa de persistencia para no hacer tantos llamados (?)
    //Mas adelante vamos a pedir que lo que entre a esta capa sea una instancia de objeto productListDTO
    //Por ahora suponemos que Vendria una lista de objetos asi ..{productid: 43543543353, quantity: 32, quantity:4}
    try{
        for(let item in productList){
            const {productId,quantity} = productList[item]
            await this.addProductInCart(cartId,productId,quantity)
        }

        //Construyo un array de promesas para que se haga todo junto
        const addProductsPromises = productList.map((item) =>
            this.addProductInCart(cartId, item.productId, item.quantity)
        )

        //Espero a que todas se resuelvan.
        await Promise.all(addProductsPromises)

        //Ahora que ya se que en la BD todo sucedio, pido el carro actualizado para devolve.
        const updatedCart = await cartRepository.getCartById(cartId)
        return updatedCart
        
    }catch(error){
        if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
        else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.addProductListToCart|')
   }
}


async countProductsInCart(cartId){
    try {
        const searchedCart = await cartRepository.getCartById(cartId)
        return searchedCart.countProducts

    } catch (error) {
        if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
        else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.countProductsInCart|')
    }
}

async cartAmount(cartId){
    try {
        const searchedCart = await cartRepository.getCartById(cartId)
        return searchedCart.cartAmount
    } catch (error) {
        if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
        else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.cartAmount|')
    }
}


}

