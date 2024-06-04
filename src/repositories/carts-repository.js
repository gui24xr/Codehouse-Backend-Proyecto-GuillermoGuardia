import { CartDTO } from "../dto/carts.dto.js"
import { CartsDAO } from "../dao/factory.js"
import { CartsDAOError,InternalServerError,DBError } from "../services/errors/custom-errors.js"

const cartsDAO = new CartsDAO()

/*
Esta capa basicamente se ocupara de comunicarse con la base de dato a travez del DAO para crud..
LO que ella recibe de DAO antes de devolverlo lo procesa mediante DTO para devolverle a service un CartsDAO un
cart con la siguiente estructura:

 {
    id: id del cart,
    products: array de productos con todos los productos ya con datos cruzados.
    countProducts: cantidad de unidades en el carrito.
    amountCart: total monetario del carro.

    cada posicion del array products tiene un objeto asi:
    { product: propiedades del producto entonces puedo ver product.id, product.price, product.quantity,etc...,
      quantity: cantidad de este producto en el carro
      subtotal: cantidad de unidades multiplicado por precio

    }

 De esta manera le damos a la capa de servicios un objeto estandarizado.

*/
export class CartRepository{

    //Le pide a la capa de persistencia la creacion del carro vacio
    //Toma el carro creado y deveulve un CartDTO para uso de la capa service.
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async createCart(){
        try{
            const newCart = await cartsDAO.createCart()
            return new CartDTO(newCart)
        }catch(error){
            if(error instanceof CartsDAOError || error instanceof DBError) throw(error)
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.stack,'Error en |CartsRepository.createCart|')
        }
    }

    //Le pide a la capa de persistencia la un carrito por su id
    //Toma el carro obtenido y deveulve un CartDTO para uso de la capa service.
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async getCartById(cartId){
        try{
            const searchedCart = await cartsDAO.getCartById(cartId)
            return new CartDTO(searchedCart)
        }catch(error){
            if(error instanceof CartsDAOError || error instanceof DBError) throw(error)
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.stack,'Error en |CartsRepository.createCart|')
        }
    }

    //Le pide a la capa persistencia que agrege un productId en un cartId
    //Nuestros metodos de capa de persistencia solo agregan el carro x lo cual luego hay que obtenerlo
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async addProductInCart(cartId,productId,quantity){
        try{
            await cartsDAO.addProductInCart(cartId,productId,quantity)
            const updatedCart = await cartsDAO.getCartById(cartId)
            return new CartDTO(updatedCart)
        }catch(error){
            if(error instanceof CartsDAOError || error instanceof DBError) throw(error)
                else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.stack,'Error en |CartsRepository.addProduct|')
        }
    }

    //Le pide a la capa de persistencia actualice la cantidad del productId
    //Nuestros metodos de capa persistencia solo actualizan la cantidad x lo cual luego hay que obtenerlo
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async updateProductQuantityInCart(cartId,productId,quantity){
        try{
            await cartsDAO.updateProductQuantityInCart(cartId,productId,quantity)
            const updatedCart = await cartsDAO.getCartById(cartId)
            return new CartDTO(updatedCart)
        }catch(error){
            if(error instanceof CartsDAOError || error instanceof DBError) throw(error)
                else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.stack,'Error en |CartsRepository.updateProductQuantityInCart|')
        }
    }

    
    async deleteProductFromCart(cartId,productId){
        try{
            await cartsDAO.deleteProductFromCart(cartId,productId)
            const updatedCart = await cartsDAO.getCartById(cartId)
            return new CartDTO(updatedCart)
        }catch(error){
            if(error instanceof CartsDAOError) throw(error)
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.stack,'Error en |CartsRepository.clearCart|')
        }
    }
    
    

    async clearCart(cartId){
        try{
            await cartsDAO.clearCart(cartId)
            const updatedCart = await cartsDAO.getCartById(cartId)
            return new CartDTO(updatedCart)
        }catch(error){
            if(error instanceof CartsDAOError) throw(error)
                else throw new InternalServerError(InternalServerError.GENERIC_ERROR,error.stack,'Error en |CartsRepository.clearCart|')
        }
    }



}

//homologar metodos de bases de datos que deben devolver