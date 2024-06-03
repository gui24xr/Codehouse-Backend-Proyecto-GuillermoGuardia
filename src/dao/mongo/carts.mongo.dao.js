//Este es el dao de mongo para carts.
import { CartModel } from "../../models/cart.model.js"
import { DBError, CartsDAOError, InternalServerError } from "../../services/errors/custom-errors.js"


export default class CartsMongoDAO{
    
    async createCart(){
        //Crea y devuelve un carro nuevo y vacio. //No es necesrio populate ya que viene vacio.
        try{
            const newCart = new CartModel({products:[]})
            await newCart.save()
            return newCart
        }catch(error){
            throw new CartsDAOError(CartsDAOError.CREATE_ERROR,'CartsMongoDao.createCart','Error al crear carro...')
        }
    }

    async getCartById(cartId){
        try {
             const searchedCart = await CartModel.findById(cartId).populate('products.product')
              if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'CartsMongoDao.getCartById',`No existe carro id${cartId}..`)
             return searchedCart      
        } catch (error) {
            if (error instanceof CartsDAOError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.message,error.code)
    }}


    //Simplemente agregan cartId,productId,quantity. No devuelve el carro. Si falla tira error.
    async addProductInCart(cartId,productId,quantity){
        try{
            const searchedCart = await CartModel.findById(cartId)
            if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'cartsDao.addProduct',`No existe carro id${cartId}..`)
            searchedCart.products.push({product:productId,quantity:quantity})
            searchedCart.markModified("carts") 
            await searchedCart.save()//Guardo en BD
        }catch(error){
            if (error instanceof CartsDAOError) throw error
            else throw new CartsDAOError(CartsDAOError.ADDING_PRODUCT,'cartsDao.addProductInCart',`Error al intentar agregar  productos en carro cartId%${cartId}...`)
        }
    }

    //Updatea la cantidad d productos qu8e existen x eso si no hay larga un error
    async updateProductQuantityInCart(cartId,productId,newQuantity){
        try{
            const searchedCart = await this.getCartById(cartId) //Aca no tiro
            if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'cartsDao.updateProductQuantityInCart',`No existe carro id${cartId}..`)
            
            //Busco el producto en el carro donde voy a aactualizar.
            const position = searchedCart.products.findIndex(item => item.product._id == productId )
            if (position < 0) throw new CartsDAOError(CartsDAOError.UPDATE_ERROR,'cartsDao.updateProductInCart',`No se puede hacer update ya que el cartId ${cartId}, no tiene un producto con id${productId}...`)
            searchedCart.products[position].quantity = newQuantity
            searchedCart.markModified("carts") 
            await searchedCart.save()//Guardo en BD
        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.UPDATE_ERROR,'CartsMongoDao.updateProductQuantityInCart','Error al intentar hacer update en carro...')
        }
    }

    async deleteProductFromCart(cartId,productId){
        try{
            const searchedCart = await this.getCartById(cartId) 
            if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'cartsDao.deleteProductFromCart',`No existe carro id${cartId}..`)
            //Busco el producto en el carro donde voy a aactualizar.
            const position = searchedCart.products.findIndex(item => item.product._id == productId )
            if (position < 0) throw new CartsDAOError(CartsDAOError.UPDATE_ERROR,'cartsDao.deleteProductFromCart',`No se puede eliminar ya que el cartId ${cartId}, no tiene un producto con id${productId}...`)
            //Elimino del array el elemento que tiene el productId buscado
            searchedCart.products.splice(position,1)
            searchedCart.markModified("carts")
            await searchedCart.save()
        }catch(error){
            if (error instanceof CartsDAOError || error instanceof DBError) throw error
            else throw new CartsDAOError(CartsDAOError.DELETE_ERROR,'cartsDao.deleteProductFromCart','mongo','Error al intentar hacer update en carro...')
        }
    }

    async clearCart(cartId){
        try{
            const searchedCart = await this.getCartById(cartId)
            if (!searchedCart)  throw new CartsDAOError(CartsDAOError.NO_EXIST_CART,'CartsMongoDao.clearCart',`No existe carro id${cartId}..`)
            searchedCart.products = [] //vacio el array y actualizo BD.
            searchedCart.markModified("carts") //Actualizo en la BD
            await searchedCart.save()
        }catch(error){
            if (error instanceof CartsDAOError) throw error
            else throw new CartsDAOError(CartsDAOError.UPDATE_ERROR,`cartsDao.clearCart','Error al intentar vaciar carro ${cartId}...`)
        }
    }

   


/*---------------- BORRAR ESTO CUANDO QUEDE TODO FINALIZADO-------------------*/

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


}


/*




*/