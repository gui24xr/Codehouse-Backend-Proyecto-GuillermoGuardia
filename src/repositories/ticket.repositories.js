import { TicketModel } from "../models/ticket.model.js";
import { InternalServerError, TicketsServiceError } from "../services/errors.service.js"

export class TicketsRepositories{

    //Si no hay consulta devuelve todos los tickets.
    async getTickets(filter){
        try {
            const ticketsList = await TicketModel.find(filter) 
            if (!ticketsList) throw new TicketsServiceError(TicketsServiceError.NO_EXIST, 'No Existen tickets para la busqueda ingresada...')
            return ticketsList
        } catch (error) {
            if (error instanceof TicketsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||TicketRepositories.getTickets||...')
        }
    }

    async getTicketById(ticketId){
        try {
            const searchedTicket = await TicketModel.findById(ticketId).populate('purchaser') 
            if (!searchedTicket) throw new TicketsServiceError(TicketsServiceError.NO_EXIST, 'No Existe ticket para la busqueda ingresada...')
            return searchedTicket._doc
        } catch (error) {
            if (error instanceof TicketsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||TicketRepositories.getTicketById||...')
        }
    
    }

  

    async getTicketsByPurchaser(purchaserId){
        try {
            const ticketsList = await TicketModel.find({purchaser:purchaserId}) 
            if (!ticketsList) throw new TicketsServiceError(TicketsServiceError.NO_EXIST, 'No Existen tickets para la busqueda ingresada...')
            return ticketsList
        } catch (error) {
            if (error instanceof TicketsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||TicketRepositories.getTicketById||...')
        }
    }


    async createTicket(purchaserId,detailsList){
        try {
            //Con el detailList calculo el price y los subamount
            //console.log('LLegaron a crearticket los datos: ', purchaserId,detailsList)
            const detailListWithSubtotal = detailsList.map(item => (
                {...item,subTotalPrice: item.unitPrice * item.requiredQuantity}
            ))
            //console.log('Listsa detlla: ',detailListWithSubtotal)
            let totalAmount = 0
            detailListWithSubtotal.forEach(item => {
                totalAmount = totalAmount + item.subTotalPrice
                //console.log('acum: ', totalAmount)
            })
            //console.log('TOTAL: ', totalAmount)

            const generatedTicket = new TicketModel({purchaser:purchaserId,price:totalAmount.toFixed(2),details:detailListWithSubtotal})
            await generatedTicket.save()
            return generatedTicket
           
        } catch (error) {
            throw new TicketsServiceError(TicketsServiceError.CREATE_ERROR,'Error al intentar crear ticket...')
        }
    }
    
}