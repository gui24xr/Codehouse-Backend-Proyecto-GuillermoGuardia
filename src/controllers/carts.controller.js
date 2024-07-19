import { CheckoutService } from "../services/checkouts.service.js"
import { CheckoutsServiceError,CartsServiceError,InternalServerError, ProductsServiceError, TicketsServiceError } from "../services/errors.service.js"
import { CartsService } from "../services/carts.service.js"
import { InputValidationService } from "../services/validation.service.js"
import { InputValidationServiceError } from "../services/errors.service.js"


const checkoutService = new CheckoutService()
const cartsService = new CartsService()

export class CartsController{
    async getCartById(req,res,next){
        const {cid:cartId} = req.params
        try {
            //Pasamos por la capa de validacion
            InputValidationService.checkRequiredField(req.params,['cid'],'CartsController.getCartById')
        
            //Si todo salio ok procedemos a tomar el carro por su id.
            const cart = await cartsService.getCartById(cartId)
            res.status(200).json({
                status: "success", 
                message: `Carrito id ${cartId} obtenido satisfactoriamente.`,
                cart:cart
                })   
        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof InputValidationServiceError) next(error)
            else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.getCartById||...'))
            }
        }
    }

    async createCart(req,res,next){
        try {
            const newCart = await cartsService.createCart()

            res.status(201).json({
                status: "success", 
                message: `Carrito creado satisfactoriamente con id ${newCart.id}`,
                cart:newCart
                })   
        } catch (error) {
            if (error instanceof CartsServiceError) next(error)
                else {
                    next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.createCart||...'))
                }
        }
    }

    async addProductInCart(req,res,next){
        const {cid:cartId,pid:productId} = req.params
        const {quantity} = req.body 
        try {
            //Pasamos por la capa de validacion
            InputValidationService.checkRequiredField(req.params,['cid','pid'],'CartsController.addProductInCart')
            InputValidationService.checkRequiredField(req.body,['quantity'],'CartsController.addProductInCart')
            const resultCart = await cartsService.addProductInCart(
                {
                    cartId:cartId,
                    productId:productId,
                    quantity:quantity,
                    user: req.currentUser.email,
                    role: req.currentUser.role,
                })
            res.status(201).json({
                status: "success", 
                message: `Productos agregados satisfactoriametente en carrito ID${resultCart.id}`,
                cart:resultCart
                })   
        } catch (error) {
            if (error instanceof CartsServiceError || error instanceof InputValidationServiceError) next(error)
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

        try{
             //Pasamos por la capa de validacion
             InputValidationService.checkRequiredField(req.params,['cid'],'CartsController.addProductListInCart')
             InputValidationService.checkRequiredField(req.body,['productsArray'],'CartsController.addProductListInCart')
             InputValidationService.isAValidProductsList(productsArray,'CartsController.addProductListInCart')
            // hACER Una funcion de validacion que valide que productsArray sea una productList

            const resultCart = await cartsService.addProductListToCart(cartId,productsArray)
            res.status(201).json({
                    status: "success", 
                    message: `Productos agregados satisfactoriametente en carrito ID${resultCart.id}`,
                    cart:resultCart
                    })   
            } catch (error) {
            if (error instanceof CartsServiceError  || error instanceof InputValidationServiceError) next(error)
            else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.AddProductInCart||...'))
            }
        
        }
    }
    //Elimina una lista de productos a un carro y devuelve el carro actualizado.
    async deleteProductFromCart(req,res,next){
        const {cid,pid} = req.params 
        try {
             //Pasamos por la capa de validacion
            InputValidationService.checkRequiredField(req.params,['cid','pid'],'CartsController.deleteProductFromCart') 

            //Si todo salio ok procedemos.
            const deleteResult = await cartsService.deleteProductFromCart(cid,pid)
            res.status(201).json({
                status: "success", 
                message: `Producto eliminados satisfactoriametente en carrito ID${deleteResult.cartId}`,
                cart:deleteResult
                })  
            } 
        catch(error){
            if (error instanceof CartsServiceError  || error instanceof InputValidationServiceError) next(error)
            else {
               next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.deleteProductFromCart||...'))
            }
        }
    }


    async clearCart(req,res,next){
        const {cid:cartId} = req.params //Obtengo el id del carro a limpiar
        try{
            InputValidationService.checkRequiredField(req.params,['cid'],'CartsController.clearCart') 
            //Si todo salio OK procedemos.
            const clearedCart = await cartsService.clearCart(cartId)
            res.status(200).json({
                status: "success", 
                message: `Carrito ID ${clearedCart.cartId} ah sido vaciado correctamente !`,
                cart:clearedCart
                })   
        }  catch (error) {
            if (error instanceof CartsServiceError  || error instanceof InputValidationServiceError) next(error)
                else {
                    next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsController.clearCart||...'))
                }
            }  
    }


    async cartCheckout(req,res,next){
        const {cid:cartId} = req.params
        try{
            //Validamos
            InputValidationService.checkRequiredField(req.params,['cid'],'CartsController.clearCart') 
            //COntinuo
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
                error instanceof CheckoutsServiceError ||
                error instanceof ProductsServiceError ||
                error instanceof TicketsServiceError ||
                error instanceof InputValidationServiceError
            ) {
                
                next(error)
            } else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||viewsController.cartCheckout||...'));
            }
            } 
            
        }
    }
    


