import { CartRepository } from "../repositories/cart.repositories.js"
import { CheckoutService } from "../services/checkout/checkout-service.js"
import { CheckoutServiceError,CartsServiceError,InternalServerError, ProductsServiceError, TicketsServiceError } from "../services/errors/custom-errors.js"
const cartRepository = new CartRepository()
const checkoutService = new CheckoutService()


export class CartsController{
    async getCartById(req,res,next){
        const {cid} = req.params
        try {
            const cart = await cartRepository.getCartById(cid)
            res.status(200).json({
                status: "success", 
                message: `Carrito obtenido satisfactoriamente con ID${cart.id}`,
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
            const newCart = await cartRepository.createCart()
            res.status(201).json({
                status: "success", 
                message: `Carrito creado satisfactoriamente con ID${newCart.id}`,
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
        const {quantity} = req.body    
        try {
            const resultCart = await cartRepository.addProductInCart(cartId,productId,quantity)
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
        const resultCart = await cartRepository.addProductsListInCart(cartId,productsArray)
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
    async deleteProductInCart(req,res,next){
        const {cid,pid} = req.params 
        try {
            const deleteResult = await cartRepository.deleteProductInCart(cid,pid)
            res.status(201).json({
                status: "success", 
                message: `Producto eliminados satisfactoriametente en carrito ID${resultCart.id}`,
                cart:deleteResult
                })  
            } 
        catch(error){
            if (error instanceof CartsServiceError) next(error)
            else {
               next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.AddProductInCart||...'))
            }
        }
    }


    async clearCart(req,res,next){
        const {cid:cartId} = req.params //Obtengo el id del carro a limpiar
        try{
            const clearedCart = await cartRepository.clearCart(cartId)
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
                
                res.status(400).render("messagepage", { message: error.message });
            } else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||viewsController.cartCheckout||...'));
            }
            }  
        }
    }

