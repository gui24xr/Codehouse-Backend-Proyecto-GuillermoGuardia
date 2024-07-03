import { CartDTO } from "../dto/carts.dto.js"
import { CartsDAO } from "../dao/factory.js"
import { CartsServiceError, CartDTOERROR } from "../services/errors.service.js"
import CartsMongoDAO from "../dao/mongo/carts.mongo.dao.js"

const cartsDAO = new CartsDAO()


export class CartRepository{


    async createEmptyCart(){
        //Pide al DAO que genere un carro vacio y toma el CartDTO retornado.
        try{
            //Ya que nuestro DAO pide un objeto vacio para crear un carro vacio.
            const createdCart = await cartsDAO.create({})
            return createdCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.create|')
        }
    }

    async createCartWithProductsList(productsList){
        //Pide al DAO que genere un carro con la lista que le pasara por parametro y toma el CartDTO retornado..
        //La lista ya deberia venir armada desde el service por lo cual hay que documentar como debe ser la lista.
        try{
            const createdCart = await cartsDAO.create({productsList: productsList})
            return createdCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.create|')
        }
    }


    async getCartById(cartId){
        //Toma el cartId que recibe y le pide al DAO que le busque, recordar que el DAO pide filtro.
        //Los dao devuelve en forma de array de DTO y en este caso devolveria solo 1.
    try{
        const searchedCart = await cartsDAO.get({cartId:cartId})
        //return new CartDTO(searchedCart)
        return searchedCart[0]
    }catch(error){
        if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
        else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.getCartById|')
    }
    }


 
    async addProductInCart(cartId,productId,quantity){
        //Ya que los update de los DAO necesitan listas de productList pide la lista actual del carro
        //Mapea la lista para enviarle y le agrega el producto en la cantidad pedida
        //Toma el DTO que el DAO le devuelve y lo retorna

        try{
            //Pido el DAO el cart la cual devuelve DTO y hay que mapear agregando un producto.
            const searchedCart = await this.getCartById(cartId)
            const mappedProductsList = searchedCart.products.map(item => ({product: item.product.productId, quantity:item.quantity}))
            //Ya tengo la lista que tiene actual el carro en la BD mapeada. ahora le agrego el nuevo producto.
            //Esto esta hecho asi xq si mañana quiero agrega cada producto individual tmn sirve, la regla  de negocio en este caso es otra
            mappedProductsList.push({product:productId,quantity:quantity})
            console.log('mapped: ',mappedProductsList)
            //Mando a actualizar y devuelvo lo actualizado.
            const updatedCart = await cartsDAO.update({cartId:cartId,productsList:mappedProductsList})
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.addProductInCart')
        }
    }


    async updateProductQuantityInCart(cartId,productId,newQuantity){
       //Ya que los update de los DAO necesitan listas de productList pide la lista actual del carro
        //Mapea la lista para enviarle y le edita el producto en la cantidad pedida
        //Toma el DTO que el DAO le devuelve y lo retorna

        try{
            //Pido el DAO el cart la cual devuelve DTO y hay que mapear agregando un producto.
            const searchedCart = await this.getCartById(cartId)
            const mappedProductsList = searchedCart.products.map(item => ({product: item.product.productId, quantity:item.quantity}))
            //Ya tengo la lista que tiene actual el carro en la BD mapeada. ahora le agrego el nuevo producto.
            //Esto esta hecho asi xq si mañana quiero agrega cada producto individual tmn sirve, la regla  de negocio en este caso es otra
            //Este metodo updatea cantidades sobre productos existentes x lo cual deberia lanzar error si ese producto no existiese en la BD
            //Si esta en la BD entonces esta en la lista mapeada. Lo busco.
            const productIndex = mappedProductsList.findIndex(item => item.product == productId )
            //Si lo encontro el index es mayor que cero y actaulizo, de lo contrario lanzo error.
           if (productIndex < 0) throw new CartsServiceError(CartsServiceError.UPDATING_PRODUCT_QUANTITY_ERROR,'CartsRepository.updateProductQuantityInCart',`No se puede modificar cantidad en cartId ${cartId}, ya que no contiene al productId${productId}...`)
            
            //Si el producto esta entonces puedo modificar la cantidad, la modifico en mapped list y luego hago el update.
            mappedProductsList[productIndex].quantity = newQuantity
            const updatedCart = await cartsDAO.update({cartId:cartId,productsList:mappedProductsList})
            //Como ya lo modifico la BD y me devuelve DTO, simplemente devuelvo lo obtenido.
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.updateProductQuantityInCart')
        }
    }

    
    async changeCartProductsList(cartId,newProductsList){
        //Pide al DAO que genere un carro con la lista que le pasara por parametro y toma el CartDTO retornado..
        //La lista ya deberia venir armada desde el service por lo cual hay que documentar como debe ser la lista.
        try{
            //Dadto que la lista de service nos viene asi [{productId,quantity}] y el daoToma {product,quantity} la mapeo hasta que arregle eso.
            const mappedList = newProductsList.map(item => ({product:item.productId,quantity:item.quantity}))
            const updatedCart = await cartsDAO.update({cartId:cartId,productsList:mappedList})
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.create|')
        }
    }


    


    async deleteProductFromCart(cartId,productId){
       //Ya que los update de los DAO necesitan listas de productList pide la lista actual del carro
        //Mapea la lista para enviarle y le elimina el product para luego mandar a hacer el update a la BD
        //Toma el DTO que el DAO le devuelve y lo retorna

        try{
            //Pido el DAO el cart la cual devuelve DTO y hay que mapear agregando un producto.
            const searchedCart = await this.getCartById(cartId)
            const mappedProductsList = searchedCart.products.map(item => ({product: item.product.productId, quantity:item.quantity}))
            //Ya tengo la lista que tiene actual el carro en la BD mapeada. ahora le agrego el nuevo producto.
            //Esto esta hecho asi xq si mañana quiero agrega cada producto individual tmn sirve, la regla  de negocio en este caso es otra
            //Este metodo updatea cantidades sobre productos existentes x lo cual deberia lanzar error si ese producto no existiese en la BD
            //Si esta en la BD entonces esta en la lista mapeada. Lo busco.
            const productIndex = mappedProductsList.findIndex(item => item.product == productId )
            //Si lo encontro el index es mayor que cerro lo elimino, de lo contrario lanzo error.
           if (productIndex < 0) throw new CartsServiceError(CartsServiceError.DELETING_PRODUCT_IN_CART_ERROR,'CartsRepository.deleteProductFromCart',`No se puede eliminar en cartId ${cartId},al productId${productId} ya que el mismo no se encuentra en este carro...`)
            //Si el producto esta entonces puedo eliminarlo mapped list y luego hago el update.
            mappedProductsList.splice(productIndex,1)
            const updatedCart = await cartsDAO.update({cartId:cartId,productsList:mappedProductsList})
            //Como ya lo modifico la BD y me devuelve DTO, simplemente devuelvo lo obtenido.
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.deleteProductFromCart')
        }
    }
    
    
    async clearCart(cartId){
      //Ya que los update de los DAO necesitan listas de productList pide la lista actual del carro
        //En este caso ya que queremos vacia la lista de productos pasamos un array vacio al update
        try{
            const updatedCart = await cartsDAO.update({cartId:cartId,productsList:[]})
            //Como ya lo modifico la BD y me devuelve DTO, simplemente devuelvo lo obtenido.
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.clearCart')
        }
    }

    async deleteCart(cartId){
        //Borra el carro pasado por parametro de la base de datos y lo elimina.
        //Devuelve el carro borrado.
        try{
            //Primero obtengo y guardo el carro para mostrarlo luego de borrarlo.
            const searchedCart = await cartsDAO.get({cartId:cartId})
            await cartsDAO.delete({cartId:cartId})
            //Si hubo error en borrado no llega  a devolverlo, se va directo al catch
            return searchedCart //Si fue borrado exitosamente devuelve true.
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.deleteCart')
        }

    }


    

}

