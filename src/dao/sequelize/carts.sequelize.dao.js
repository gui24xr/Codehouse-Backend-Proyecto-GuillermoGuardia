//Este es el dao de mongo para carts.
import { CartModel } from "../../models/cart.model.js"
import { DBError, CartsDAOError } from "../../services/errors/custom-errors.js"

export class CartsDAO{
    
    async createCart(){
        //Crea un carro nuevo y vacio.
        try{
            const newCart = new CartModel({products:[]})
            await newCart.save()
            return newCart
        }catch(error){
            throw new CartsDAOError(CartsDAOError.CREATE_ERROR,'cartsDao.createCart','mongo','Error al crear carro...')
        }
    }

    async getCartById(cartId){
        try {
             const searchedCart = await CartModel.findById(cartId).populate('products.product')
              if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'cartsDao.getCartById','mongo',`No existe carro id${cartId}..`)
             return searchedCart      
        } catch (error) {
            if (error instanceof CartsDAOError) throw error
            throw new DBError('cartsDao.getCartById',error.message,error.code)
    }}

    async getProductsInCart(cartId){
        try {
            const searchedCart = await this.getCartById(cartId)
            if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'cartsDao.getCartById','mongo',`No existe carro id${cartId}..`)
            return searchedCart.products      
        } catch (error) {
            if (error instanceof CartsDAOError) throw error
            throw new DBError('cartsDao.getProductsInCart',error.message,error.code)
    }}


    async existProductInCart(cartId,productId){
        try{
            const searchedCart = await this.getCartById(cartId)
            if (searchedCart.products.some(item => item.product._id == productId)) return true
            else return false

        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.GET_ERROR,'cartsDao.existProductInCart','mongo','Error al comprobar existencia de productos en carro...')
        }
    }

    //conteo de un producto
    async getProductQuantityInCart(cartId,productId){
        try{//Si existe veo que cantidad hay de ese productId
            const searchedCart = await this.getCartById(cartId)
            if (searchedCart.products.some(item => item.product._id == productId)){
                const position = searchedCart.products.findIndex(item => item.product._id == productId )
                return searchedCart.products[position].quantity
            }
            else return 0

        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.GET_ERROR,'cartsDao.existProductInCart','mongo','Error al comprobar existencia de productos en carro...')
        }
    }

    //conteo de cantidad total
    async countProductsInCart(cartId){
        try{
            const searchedCart = await this.getCartById(cartId)
            let productsQuantity = 0
            searchedCart.products.forEach( productItem => productsQuantity = productsQuantity + productItem.quantity)
            return productsQuantity
        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.GET_ERROR,'cartsDao.countProductsInCart','mongo',`Error al intentar conteo de productos en cartId ${cartId}`)
        }
    }

        //conteo de cantidad total
    async cartAmount(cartId){
            try{
                const searchedCart = await this.getCartById(cartId)
                let amount = 0
                searchedCart.products.forEach( productItem => amount = amount + ( productItem.product.price * productItem.quantity))
                return amount.toFixed(2)
            }catch(error){
                if (error instanceof CartsDAOError || error instanceof DBError) throw error
                else throw new CartsDAOError(CartsDAOError.GET_ERROR,'cartsDao.countProductsInCart','mongo',`Error al intentar obtener monto total en cartId ${cartId}`)
            }
        }

    async addProduct(cartId,productId,quantity){
        try{
            const searchedCart = await this.getCartById(cartId)
            if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'cartsDao.getCartById','mongo',`No existe carro id${cartId}..`)
            searchedCart.products.push({product:productId,quantity:quantity})
            searchedCart.markModified("carts") 
            await searchedCart.save()//Guardo en BD
            return searchedCart
        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.GET_ERROR,'cartsDao.addProductInCart','mongo','Error al intentar agregar  productos en carro...')
        }
    }

    //Updatea la cantidad d productos qu8e existen x eso si no hay larga un error
    async updateProductQuantityInCart(cartId,productId,newQuantity){
        try{
        //NI intento el update si no esta el productID
          if (!this.existProductInCart(cartId,productId)) throw new CartsDAOError(CartsDAOError.UPDATE_ERROR,'cartsDao.addProductInCart','mongo',`No se puede hacer update ya que el cartId ${cartId}, no tiene un producto con id${productId}...`)
/*
        //Si el producto esta y me pide que acumule le acumulo la cantidad
         const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cartId, 'products.product': productId },
                { $set: { 'products.$.quantity':newQuantity } },
                { new: true }
            )
        
            await updatedCart.save()
            return updatedCart
            */
            const searchedCart = await this.getCartById(cartId)
            if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'cartsDao.getCartById','mongo',`No existe carro id${cartId}..`)
            const position = searchedCart.products.findIndex(item => item.product._id == productId )
            searchedCart.products[position].quantity = newQuantity
            searchedCart.markModified("carts") 
            await searchedCart.save()//Guardo en BD
            return searchedCart
          
        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.UPDATE_ERROR,'cartsDao.updateProductQuantityInCart','mongo','Error al intentar hacer update en carro...')
        }
    }

    async clearCart(cartId){
        try{
            const searchedCart = await this.getCartById(cartId)
            searchedCart.products = [] //vacio el array y actualizo BD.
            searchedCart.markModified("carts") //Actualizo en la BD
            await searchedCart.save()
            return searchedCart
        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.UPDATE_ERROR,`cartsDao.addProductInCart','mongo','Error al intentar vaciar carro ${cartId}...`)
        }
    }

    async deleteProductFromCart(cartId,productId){
        try{
        //NI intento el update si no esta el productID
          if (!this.existProductInCart(cartId,productId)) throw new CartsDAOError(CartsDAOError.DELETE_ERROR,'cartsDao.addProductInCart','mongo',`No se eliminar ,el cartId ${cartId}, no tiene un producto con id${productId}...`)

        //Si el producto esta y me pide que acumule le acumulo la cantidad
         const updatedCart = await CartModel.findOneAndUpdate.populate('products.product')(
                { _id: cartId, 'products.product': productId },
                { $pull: { products: { product: productId } } },
                { new: true }
            )
        
            return updatedCart
        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.DELETE_ERROR,'cartsDao.deleteProductFromCart','mongo','Error al intentar hacer update en carro...')
        }
    }





}