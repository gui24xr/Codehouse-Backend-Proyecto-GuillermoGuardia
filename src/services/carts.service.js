import { CartsServiceError, CartDTOERROR, ProductsServiceError, ProductDTOERROR } from "./errors.service.js"
import { CartRepository } from "../repositories/carts-repository.js"
import { ProductsService } from "./products.service.js"

/*Aca hacemos toda la logica de negocio usando nuestro repositories */
const cartsRepository = new CartRepository()

export class CartsService {

    async createCart(){
        try{
            const createdCart = await cartsRepository.createEmptyCart()
            return createdCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.createCart|')
        }
    }



    async getCartById(cartId){
        try {
            const searchedCart = await cartsRepository.getCartById(cartId)
            return searchedCart
        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.getCartById|')
        }
    }


   
    async getProductsInCart(cartId){
        try {
            const searchedCart = await cartsRepository.getCartById(cartId)
            return searchedCart.products

        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.getProductsInCart|')
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
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.getProductQuantityInCart|')
        }
    }
    

    async clearCart(cartId){
        try {
           const updatedCart = await cartsRepository.clearCart(cartId)
           return updatedCart
          } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.clearCart|')
          }
        }



    async checkProductOwner({user,productId}){
        /*Esta funcion va a pedir al servicio de productos el owner del producto.
          Si owner producto igual user enonces lanza error y no se lleva  a cabo la agregacion.
        */
        //console.log('check: ', user,productId)
        try{
            const productsService =  new ProductsService()
            const searchResultObject = await productsService.findProducts({productId:productId,owner:user})
            if (searchResultObject.totalProducts > 0){
            // console.log('Habria que lanzar error para no permitir el agregado.')
             throw new CartsServiceError(CartsServiceError.BLOCKED_TO_PREMIUM_USERS,'CartsService.checkProductOwner','Los usuarios no premium no pueden agregar sus propios productos al carrito.')
            }   
        }catch(error){
      
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR || error instanceof ProductsService||error instanceof ProductDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.checkProductOwner|')
        }
     
        
    }    


    async addProductInCart({user,role,cartId,productId,quantity}){
        try {
          /* La logica del negocio dice:
            1-Si no existe el producto en el carro, lo agrego...
            2- Si no conozco la cantidad deseada agrego 1, si no quantity
            3- Si el producto esta en el carro sumo la cantidad quantity y si no conozco la cantidad le sumom 1 unidad

            4- Si el user es premium y es owner de el producto entonces no lo agrega
           Deveulve el carro actualizado si es que el producto finalmente se agrego, y error en caso contrario
            */

           //Si el rol es premium chequeamos que no coincidan productId y owner
          if (role == 'premium') await this.checkProductOwner({user:user,productId:productId})
         
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
            //console.log('error en cartser: ', error)
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR || error instanceof ProductsService||error instanceof ProductDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.addProductInCart|')
        }
    }

    async deleteProductFromCart(cartId,productId){
        try{
            const updatedCart = await cartsRepository.deleteProductFromCart(cartId,productId)
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.deleteProductFromCart|')
        }
    }
    

   async addProductListToCart(cartId,newProductsList){
   /* Para no hacer multiples llamadas a la base de datos vamos a pedir la lista actual del carro, y con las
   reglas de negocio vamos a construir una lista nueva entre la actual y la que viene por parametro.
   Una vez construida usamos el metodo del repository que cambia la lista entera del carro. Obtenemos el 
   carro actualizado que nos deveulve el repository y lo devolvemos,de esta manera evitamos muchas llamadas a la
   base de datos... 
   La productList recibidda tiene formato [{productId:'dgdggd', quantity:323}]
   */
    try{
       //Pedimos el carro para obtener su lista actual y la mapeamos para que ya tenga el formato que pide el repository...
       const searchedCart = await cartsRepository.getCartById(cartId)
       const currentCartList = searchedCart.products.map ( item => ({productId: item.product.productId, quantity: item.quantity}))
         
       //Recorremos la lista de productos para agregar y vamos viendo si hay que agregar producto o actualizar cantidad.
       newProductsList.forEach( itemInNewList => {
            //Busco el producto en la currentCartList
            const productInCurrentCartListPosition = currentCartList.findIndex(itemInCurrentList => itemInCurrentList.productId == itemInNewList.productId)
            //Si es menor a cero, o sea no esta el producto de la lista nueva en el carro, entonces agregamos el producto de la lista nueva a la currentList
            if (productInCurrentCartListPosition < 0) currentCartList.push(itemInNewList)
            else{
                //Pero si ya esta el producto hay que sumar la cantidad 
                currentCartList[productInCurrentCartListPosition].quantity = currentCartList[productInCurrentCartListPosition].quantity + itemInNewList.quantity
            }
       })
       //Tenemos la currentList actualizada. Se la pasamos al repository para que haga el trabajo en la BD.
       const updatedCart = await cartsRepository.changeCartProductsList(cartId,currentCartList)
       //Nos devuelve el dto actualizado, lo devolvemos...
       return updatedCart
        
    }catch(error){
        if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
        else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.addProductListToCart|')
   }
}


async deleteProductListToCart(cartId,deleteProductsList){
    /* Lo mismo que addProductListToCart pero borramos los productos que vienen en la lista, si es que estan en el carro.
    */
     try{
        //Pedimos el carro para obtener su lista actual y la mapeamos para que ya tenga el formato que pide el repository...
        const searchedCart = await cartsRepository.getCartById(cartId)
        const currentCartList = searchedCart.products.map ( item => ({productId: item.product.productId, quantity: item.quantity}))
          
        //Recorremos la lista de productos para agregar y vamos viendo si hay que agregar producto o actualizar cantidad.
        deleteProductsList.forEach( itemInDeleteList => {
             //Busco el producto en la currentCartList
             const productInCurrentCartListPosition = currentCartList.findIndex(itemInCurrentList => itemInCurrentList.productId == itemInDeleteList.productId)
             //Si es mayor igual a cero, el producto esta en el carro, miro la cantidad y si al borrar cantidad a borrar menos actual entonces lo borro 
             if (productInCurrentCartListPosition >= 0) {
                 //Pero si ya esta el producto hay que sumar la cantidad 
                 const currentProductQuantity = currentCartList[productInCurrentCartListPosition].quantity 
                 const quantityToDelete = itemInDeleteList.quantity
                 const newQuantity = currentProductQuantity - quantityToDelete
                 if (newQuantity <= 0){
                    //Lo borro de la currentList.
                    currentCartList.splice(productInCurrentCartListPosition,1)
                 }
                 else{
                    //Si la resta de uno menos le pongo como cantidad la newQuantity
                    currentCartList[productInCurrentCartListPosition].quantity = newQuantity
                 }
             }
        })
        //Tenemos la currentList actualizada. Se la pasamos al repository para que haga el trabajo en la BD.
        const updatedCart = await cartsRepository.changeCartProductsList(cartId,currentCartList)
        //Nos devuelve el dto actualizado, lo devolvemos...
        return updatedCart
         
     }catch(error){
         if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
         else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.addProductListToCart|')
    }
 }


async countProductsInCart(cartId){
    try {
        const searchedCart = await cartsRepository.getCartById(cartId)
        return searchedCart.countProducts

    } catch (error) {
        if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
        else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.countProductsInCart|')
    }
}

async cartAmount(cartId){
    try {
        const searchedCart = await cartsRepository.getCartById(cartId)
        return searchedCart.cartAmount
    } catch (error) {
        if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
        else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsService.cartAmount|')
    }
}


async checkoutCartById(cartId){
    //Ya nos trae un dto de carts que tiene una lista de dto products
    try {
        const listToPreOrder = []; //LosProducto-cantidad que iran al ticket
        const listNoPreOrder = []; //Lo que no ira al ticket...
        const searchedCart = await cartsRepository.getCartById(cartId)//Obtengo cartDTO
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


}

