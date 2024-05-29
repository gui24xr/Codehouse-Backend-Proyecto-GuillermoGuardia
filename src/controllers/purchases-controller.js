
import { CheckoutService } from "../services/checkout/checkout-service.js";
import { TicketsRepositories } from "../repositories/ticket.repositories.js";
import { CheckoutServiceError,CartsServiceError,InternalServerError, ProductsServiceError, TicketsServiceError } from "../services/errors/custom-errors.js"


const checkoutService = new CheckoutService()
const ticketRepositories = new TicketsRepositories()

export class PurchasesController{
   
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
                
                next(error)
            } else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||checkoutController.cartCheckout||...'));
            }
        }
    }


    async singlePurchase(req,res,next){
        const {productId,quantity,userId} = req.body
      
        try{
            const generatedTicket = await checkoutService.checkoutProductBuy(productId,quantity,userId)
            res.status(200).json({
                status: "success", 
                message: `Compra realizada con exito. Se genero el ticket ${generatedTicket.code}}.`,
                ticket: generatedTicket
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
                next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||checkoutController.singlePurchase||...'));
            }
        }
        
    }

    async getTickets(req,res,next){
        //Devuelve los tickets segun filtro... pero
        // Validación manual de los parámetros de consulta
   
    // Validación de tipos de datos (opcional)
    if (isNaN(code) || isNaN(userId) || isNaN(purchaserId)) {
        return res.status(400).json({
            status: "error",
            message: "Los parámetros productId, quantity y userId deben ser números"
        });

    //Busco los tckets
    }

        res.send('Tickets')
    }
    
}