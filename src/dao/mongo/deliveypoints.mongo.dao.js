//Este es el dao de mongo para carts.
import { DeliveryPointModel } from "../../models/deliverypoint.model.js"
import { DeliveryPointDTO } from "../../dto/deliverypoint.dto.js"
import { CartsServiceError, CartDTOERROR, } from "../../services/errors.service.js"
import { DeliveryPointsServiceError, DeliveryPointDTOERROR } from "../../services/errors.service.js"


export default class DeliveryPointsMongoDAO{


    //funcion interna para construir los DTO
    //Esta es interna de cada dao x lo cual no debe ser homologado
    //Lo que es homologado es el 
    transformInCartDO(cartFromDB){
        return new CartDTO({
            id: cartFromDB._id,
            products: cartFromDB.products
        })
    }
    
    //Recibe un objeto
    async createDeliveryPoint(createDeliveryPointObject){
        //Crea y devuelve un carro nuevo y vacio. //No es necesrio populate ya que viene vacio.
        try{
            const newCart = new CartModel({products:[]})
            await newCart.save()
            //return newCart
            return this.transformInCartDO(newCart)
        }catch(error){
            if (error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.CREATE_ERROR,'CartsMongoDao.createCart','Error al crear carro...')
        }
    }

    async getDeliveryPointById(cartId){
        try {
             const searchedCart = await CartModel.findById(cartId).populate('products.product')
              if (!searchedCart)  throw new CartsServiceError(CartsServiceError.CART_NO_EXIST,'CartsMongoDao.getCartById',`No existe carro id${cartId}..`)
             //return searchedCart
              return this.transformInCartDO(searchedCart)      
        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsMongoDao.getCartById|')
    }}



    //Updatea la cantidad d productos qu8e existen x eso si no hay larga un error
    async updateDeliveryPoint(cartId,productId,newQuantity){
        try{
            const searchedCart = await this.getCartById(cartId) //Aca no tiro
            if (!searchedCart)  throw new CartsServiceError(CartsServiceError.UPDATING_ERROR,'CartsMongoDao.updateProductQuantityInCart',`No existe carro id${cartId}..`)
            
            //Busco el producto en el carro donde voy a aactualizar.
            const position = searchedCart.products.findIndex(item => item.product._id == productId )
            if (position < 0) throw new CartsServicError(CartsServiceError.UPDATING_ERROR,'CartsMongoDao.updateProductInCart',`No se puede hacer update ya que el cartId ${cartId}, no tiene un producto con id${productId}...`)
            searchedCart.products[position].quantity = newQuantity
            searchedCart.markModified("carts") 
            await searchedCart.save()//Guardo en BD
            return this.transformInCartDO(searchedCart)   
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsMongoDao.updateProductQuantityInCart|')
        }
    }

    async deleteDeliveryPoint(cartId,productId){
        try{
            const searchedCart = await this.getCartById(cartId) 
            if (!searchedCart)  throw new CartsServiceError(CartsServiceError.DELETING_ERROR,'CartsMongoDao.deleteProductFromCart',`No existe carro id${cartId}..`)
            //Busco el producto en el carro donde voy a aactualizar.
            const position = searchedCart.products.findIndex(item => item.product._id == productId )
            if (position < 0) throw new CartsServiceError(CartsServiceError.DELETING_ERROR,'CartsMongoDao.deleteProductFromCart',`No se puede eliminar ya que el cartId ${cartId}, no tiene un producto con id${productId}...`)
            //Elimino del array el elemento que tiene el productId buscado
            searchedCart.products.splice(position,1)
            searchedCart.markModified("carts")
            await searchedCart.save()
            return this.transformInCartDO(searchedCart)   
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsMongoDao.deleteProductFromCart|')
        }
    }

   
   
}