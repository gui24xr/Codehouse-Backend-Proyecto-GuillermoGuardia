//Este es el dao de mongo para carts.
import { DeliveryPointModel } from "../../models/deliverypoint.model.js"
import { DeliveryPointDTO, DeliveryPointConstructionObject } from "../../dto/deliverypoint.dto.js"
import { CartsServiceError, CartDTOERROR, } from "../../services/errors.service.js"
import { DeliveryPointsServiceError, DeliveryPointDTOERROR } from "../../services/errors.service.js"


export default class DeliveryPointsMongoDAO{


    //funcion interna para construir los DTO
    //Esta es interna de cada dao x lo cual no debe ser homologado
    //Lo que es homologado es el 
    transformInDeliveryPointDTO(cartFromDB){
        return new DeliveryPointDTO({
            id: cartFromDB._id,
            products: cartFromDB.products
        })
    }
    
    //Recibe un objeto
    async createDeliveryPoint(createDeliveryPointObject) {
        try {
            const newDeliveryPoint = new DeliveryPointModel({
                receiver: {
                    name: 'Juan',
                    last_name: 'Perez'
                },
                address: {
                    street: 'Calle Principal',
                    streetNumber: '123',
                    city: 'Ciudad Ejemplo',
                    state: 'Estado Ejemplo',
                    zip_code: '12345',
                    country: 'País Ejemplo',
                    floor: '2',
                    apartment: 'A'
                },
                coordinates: {
                    latitude: 40.7128,
                    longitude: -74.006
                },
                phones: ['123456789', '987654321'],
                location_type: 'Domicilio Residencial'
            });
    
            await newDeliveryPoint.save();
    
            console.log('Nuevo punto de entrega guardado:', newDeliveryPoint);
            return newDeliveryPoint;
        } catch (error) {
            console.error('Error al crear el punto de entrega:', error);
            throw error; // Puedes manejar el error según necesites aquí
        }
    }
    

    async getDeliveryPointById(cartId){
        try {
             const searchedCart = await CartModel.findById(cartId).populate('products.product')
              if (!searchedCart)  throw new CartsServiceError(CartsServiceError.CART_NO_EXIST,'CartsMongoDao.getCartById',`No existe carro id${cartId}..`)
             //return searchedCart
              return this.transformInDeliveryPointDTO(searchedCart)      
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
            return this.transformInDeliveryPointDTO(searchedCart)   
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
            return this.transformInDeliveryPointDTO(searchedCart)   
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsMongoDao.deleteProductFromCart|')
        }
    }

   
   
}