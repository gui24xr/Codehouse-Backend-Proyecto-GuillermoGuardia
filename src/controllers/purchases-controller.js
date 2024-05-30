
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
    //Si no hay queries devuelve todos los tickets.
    //Si hay queries Devuelve los tickets segun filtro... 
    //Si no llega ningun parametro devuelve una lista con todos los tickets de la bd.
    //Si llega code busca el ticket por code y lo devuelve
    //si llega userId devuelve todos los tickets de dicho usuario
    //Proximamente implementamos busqueda por fecha.
        const {code, purchaser} = req.query
        //Uso return en cada if para que no vaya alsiguiente usar else If y continuar el flujo innecesariamente.
        try{
            if (code && purchaser){
                
                const ticketsList = await ticketRepositories.getTickets({code:code, purchaser:purchaser})
                if (ticketsList.length >= 1){
                    return res.status(200).json({
                        status: "success", 
                        message: `Ticket Obtenido OK`,
                        ticket: ticketsList[0] //Porque es unico pero getTickes me devolvio un arra
                        }) 
                }
                else{
                    return res.status(404).json({
                        status: "error", 
                        message: `No existe un ticket con codigo ${code} para purchaser ${purchaser}.`,
                        }) 
                }
            }

            if (code){
                const ticketsList = await ticketRepositories.getTickets({code:code})
                if (ticketsList.length >= 1){
                    return res.status(200).json({
                        status: "success", 
                        message: `Ticket Obtenido OK`,
                        ticket: ticketsList[0] //Porque es unico pero getTickes me devolvio un arra
                        }) 
                }
                else{
                    return res.status(404).json({
                        status: "error", 
                        message: `No existe un ticket con codigo ${code}.`,
                        }) 
                }
                 
            }

            if (purchaser){
                const ticketsList = await ticketRepositories.getTickets({purchaser:purchaser})
                if (ticketsList.length >= 1){
                    return res.status(200).json({
                        status: "success", 
                        message: `Tickets de purchaser ${purchaser}`,
                        ticketsQuantity: ticketsList.length,
                        ticket: ticketsList //Porque es unico pero getTickes me devolvio un arra
                        }) 
                }
                else{
                    return res.status(404).json({
                        status: "error", 
                        message: `No existe tickets para purchaser ${purchaser}.`,
                        }) 
                }
            }

        
                //Si no hay parametros en la query.... y se llega aqui solo en caso de no haber ya que los if tienen return.
                const ticketsList = await ticketRepositories.getTickets()
                if (ticketsList.length >= 1){
                    return res.status(200).json({
                        status: "success", 
                        message: `Tickets Obtenidos OK`,
                        ticketsQuantity: ticketsList.length,
                        ticket: ticketsList //Porque es unico pero getTickes me devolvio un arra
                        }) 
                }
                else{
                    return res.status(404).json({
                        status: "error", 
                        message: `No existen tickets en nuestra base de datos....`,
                        }) 
                }
            

        }catch(error){
            if (error instanceof TicketsServiceError) next(error)
            else next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||PurchaseController.getTickets||...'));
            }
    }

    
}