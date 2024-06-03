import { CartsServiceError, InternalServerError } from "./errors/custom-errors.js"
import { CartsRepository } from "../repositories/carts-repositories.js"

/*Aca hacemos toda la logica de negocio usando nuestro repositories */
const cartsRepository = new CartsRepository()

export class CartsService {

    async createCart(){
        try{
            const newCart = await cartsRepository.createCart()
            return newCart
        }catch(error){
          throw new CartsServiceError(CartsServiceError.CREATE_ERROR,`Error al intentar crear el carrito`)
        }
    }



    async getCartById(cartId){
        try {
            const searchedCart = await cartsRepository.getCartById(cartId)
            return searchedCart
        } catch (error) {
          // if (error instanceof CartsServiceError) throw error
           //else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.getCartById||...')
        }
    }


    async getProductsInCart(cartId){
        try {
            const searchedCart = await cartsRepository.getCartById(cartId)
            return searchedCart.products

        } catch (error) {
            
          // if (error instanceof CartsServiceError) throw error
           //else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.getCartById||...')
        }
    }


    //Deveulve la cantidad de producto, si el producto no se encuentra devuelve cero, si no, la cantidad
    async getProductQuantityInCart(cartId,productId){
        try{
            const searchedCart = await cartsRepository.getCartById(cartId)
            //COmo obtengo un dto y lo conoce lo busca
            const productPosition = searchedCart.products.findIndex(item => item.product.productId == productId)
            if (productPosition>=0){
                return searchedCart.products[productPosition].quantity
            }else{
                return 0
            }
        }catch(error){

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
          const updatedCart = await cartsRepository.addProductInCart(cartId,productId,quantity || 1)
          return updatedCart
          }
          else{
            const newQuantity = (productQuantityInCart + quantity) || (productQuantityInCart + 1)
            const updatedCart = await cartsRepository.updateProductQuantityInCart(cartId,productId,newQuantity)
            return updatedCart
          }

        } catch (error) {
            if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.AddProductInCart||...')
        }
    }

    async deleteProductFromCart(cartId,productId){
        try{
            const updatedCart = await cartsRepository.deleteProductFromCart(cartId,productId)
            return updatedCart
        }catch(error){
            if(error instanceof CartsDAOError) throw(error)
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.stack,'Error en |CartsRepository.clearCart|')
        }
    }
    
    async clearCart(cartId){
        try {
           const updatedCart = await cartsRepository.clearCart(cartId)
           return updatedCart
          } catch (error) {
           if (error instanceof CartsServiceError) throw error
           else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.AddProductInCart||...')
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
        const updatedCart = await cartsRepository.getCartById(cartId)
        return updatedCart
        
    }catch(error){

   }
}


async countProductsInCart(cartId){
    try {
        const searchedCart = await cartsRepository.getCartById(cartId)
        return searchedCart.countProducts

    } catch (error) {
      // if (error instanceof CartsServiceError) throw error
       //else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.getCartById||...')
    }
}

async cartAmount(cartId){
    try {
        const searchedCart = await cartsRepository.getCartById(cartId)
        return searchedCart.cartAmount
    } catch (error) {
      // if (error instanceof CartsServiceError) throw error
       //else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.getCartById||...')
    }
}


}

/*

    //Si el producto existe en el carro entonces lo elimina y devuelve el carro actualizado.
    async deleteProductInCart(cartId,productId){
        try {console.log('LLego: ',cartId, productId)
            const searchedCart = await CartModel.findById(cartId)
            //No Existe el carro, me voy....
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`No existe carrito con ID${cartId}`)
            //Existe el producto en el carro?
            const existProductInCart = searchedCart.products.some(item => item.product.toString() == productId )
            //No Existe el producto en el carro me voy....
            if(!existProductInCart) throw new CartsServiceError(CartsServiceError.PRODUCT_NO_DELETED,`No existe el producto ${productId} en carrito con ID${cartId}`)
           
            //Existe el producto en el carro, procedo.
            const position = searchedCart.products.findIndex(item => item.product.toString() == productId )
            searchedCart.products.splice(position,1)
            searchedCart.markModified("carts")
            await searchedCart.save()
            return {
                ...searchedCart.formatToOutput(),
                countProducts:this.#countProducts(searchedCart),
                cartAmount:this.#cartAmount(searchedCart)
                }
        } catch (error) {
            if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.deleteProductInCart||...')
        }
    }




    async addProductsListInCart(cartId,productsList){
        try {
            //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
            const searchedCart = await CartModel.findById(cartId)
            //Si no exist el carrito salgo devolviendo null
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`No existe carrito con ID${cartId} por lo cual no se pueden agregar productos...`)
            //Si el carrito existe recorro el array y voy actualizando el array Products
             productsList.forEach( item => {
                const existProductInCart = searchedCart.products.some(productItem => productItem.product.toString() == item.productId )
                if (existProductInCart){
                    console.log('Existe el producto con ese ID actualizaremos su cantidad...')
                    const position = searchedCart.products.findIndex(productItem => productItem.product.toString() == item.productId )
                    //Si me pasaron cantidad por parametro pongo esa cantidad, si no, solo agrego uno.
                   searchedCart.products[position].quantity += item.quantity
                    }
                else{//Si el carro no tiene este producto le creo el item con la cantidad
                    searchedCart.products.push({product:item.productId,quantity:item.quantity})
                } 
            })
            //Actualice todo el array ahora guardo,Actualizo en la BD y retorno.
           searchedCart.markModified("carts")
           await searchedCart.save()
           return {
            ...searchedCart.formatToOutput(),
            countProducts:this.#countProducts(searchedCart),
            cartAmount:this.#cartAmount(searchedCart)
        } 
        } catch (error) {
             if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.deleteProductInCart||...')
        }
    }


*/

/*
    async countProductsInCart(cartId){
        try {
               //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
               //console.log('Entro el ID: ', cartId)
               const searchedCart = await CartModel.findById(cartId)
               //Si no exist el carrito salgo devolviendo null
              //Si no exist el carrito me voy al throw para devolver el error.
                if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`Imposible eliminar, No existe carrito con ID${cartId}`)
                
                let productsQuantity = 0
                searchedCart.products.forEach( item => productsQuantity = productsQuantity + item.quantity)
                return productsQuantity

        } catch (error) {
            if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.countProductsInCart||...')
        }
    }
    */
