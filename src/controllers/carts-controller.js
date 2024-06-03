import { CheckoutService } from "../services/checkout/checkout-service.js"
import { CheckoutServiceError,CartsServiceError,InternalServerError, ProductsServiceError, TicketsServiceError } from "../services/errors/custom-errors.js"

import { CartsService } from "../services/carts.service.js"
const checkoutService = new CheckoutService()
const cartsService = new CartsService()

export class CartsController{
    async getCartById(req,res,next){
        const {cid:cartId} = req.params
        try {
            //const cart = await cartRepository.getCartById(cid)
            const cart = await cartsService.getCartById(cartId)
            res.status(200).json({
                status: "success", 
                message: `Carrito id ${cartId} obtenido satisfactoriamente.`,
                cart:cart
                })   
        } catch (error) {
            if (error instanceof CartsServiceError) next(error)
            else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.getCartById||...'))
            }
        }
    }

    async createCart(req,res,next){
        try {
            //const newCart = await cartRepository.createCart()
            const newCart = await cartsService.createCart()
            res.status(201).json({
                status: "success", 
                message: `Carrito creado satisfactoriamente con id ${newCart.id}`,
                cart:newCart
                })   
        } catch (error) {
            if (error instanceof CartsServiceError) next(error)
                else {
                    next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.getCartById||...'))
                }
        }
    }

    async addProductInCart(req,res,next){
        const {cid:cartId,pid:productId} = req.params
        console.log(req.params, req.body)
        const {quantity} = req.body    
        try {
            //const resultCart = await cartRepository.addProductInCart(cartId,productId,quantity)
            const resultCart = await cartsService.addProductInCart(cartId,productId,quantity)
            res.status(201).json({
                status: "success", 
                message: `Productos agregados satisfactoriametente en carrito ID${resultCart.id}`,
                cart:resultCart
                })   
        } catch (error) {
            if (error instanceof CartsServiceError) next(error)
            else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.AddProductInCart||...'))
            }
        }
    }

    //Agrega una lista de productos a un carro y devuelve el carro actualizado.
    async addProductListInCart(req,res,next){
        const {cid:cartId} = req.params
        const {productsArray} = req.body 
        console.log(productsArray)
        const resultCart = await cartsService.addProductListToCart(cartId,productsArray)
        res.status(201).json({
                status: "success", 
                message: `Productos agregados satisfactoriametente en carrito ID${resultCart.id}`,
                cart:resultCart
                })   
        } catch (error) {
            if (error instanceof CartsServiceError) next(error)
            else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.AddProductInCart||...'))
            }
        
    }

    //Elimina una lista de productos a un carro y devuelve el carro actualizado.
    async deleteProductFromCart(req,res,next){
        const {cid,pid} = req.params 
        try {
            const deleteResult = await cartsService.deleteProductFromCart(cid,pid)
            res.status(201).json({
                status: "success", 
                message: `Producto eliminados satisfactoriametente en carrito ID${deleteResult.id}`,
                cart:deleteResult
                })  
            } 
        catch(error){
            if (error instanceof CartsServiceError) next(error)
            else {
               next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.deleteProductFromCart||...'))
            }
        }
    }


    async clearCart(req,res,next){
        const {cid:cartId} = req.params //Obtengo el id del carro a limpiar
        try{
            const clearedCart = await cartsService.clearCart(cartId)
            res.status(200).json({
                status: "success", 
                message: `Carrito ID ${clearedCart.id} ah sido vaciado correctamente !`,
                cart:clearedCart
                })   
        }  catch (error) {
            if (error instanceof CartsServiceError) next(error)
                else {
                    next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.clearCart||...'))
                }
            }  
    }


    async cartCheckout(req,res,next){
        const {cid:cartId} = req.params
        try{
           const checkoutResult = await checkoutService.checkOutCart(cartId)
           console.log('cjec: ', checkoutResult)
           res.status(200).json({
            status: "success", 
            message: `Checkout Carrito ID ${cartId} generado correctamente...`,
            checkoutResult: checkoutResult
            })   
        }catch(error){
            if (
                error instanceof CartsServiceError ||
                error instanceof CheckoutServiceError ||
                error instanceof ProductsServiceError ||
                error instanceof TicketsServiceError
            ) {
                
                next(error)
            } else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||viewsController.cartCheckout||...'));
            }
            } 
            
        }
    }
    


