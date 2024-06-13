import { CartDTO } from "../dto/carts.dto.js"
import { CartsDAO } from "../dao/factory.js"
import { CartsServiceError, CartDTOERROR } from "../services/errors.service.js"

const cartsDAO = new CartsDAO()


export class CartRepository{


    async createCart(){
        try{
            const newCart = await cartsDAO.createCart()
            return newCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.createCart|')
        }
    }


    async getCartById(cartId){
        try{
            const searchedCart = await cartsDAO.getCartById(cartId)
            //return new CartDTO(searchedCart)
            return searchedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.getCartById|')
        }
    }


    async addProductInCart(cartId,productId,quantity){
        try{
            const updatedCart = await cartsDAO.addProductInCart(cartId,productId,quantity)
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.addProductInCart')
        }
    }


    async updateProductQuantityInCart(cartId,productId,quantity){
        try{
            const updatedCart = await cartsDAO.updateProductQuantityInCart(cartId,productId,quantity)
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.addProductInCart|')
        }
    }

    
    async deleteProductFromCart(cartId,productId){
        try{
            const updatedCart = await cartsDAO.deleteProductFromCart(cartId,productId)
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.deleteProductFromCart|')
        }
    }
    
    
    async clearCart(cartId){
        try{
            const updatedCart = await cartsDAO.clearCart(cartId)
            return updatedCart
        }catch(error){
            if (error instanceof CartsServiceError || error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.INTERNAL_SERVER_ERROR,'|CartsRepository.clearCart|')
        }
    }



}

