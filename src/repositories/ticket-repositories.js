import { TicketModel } from "../models/ticket.model.js";
import { InternalServerError, TicketsServiceError } from "../services/errors.service.js"


import { TicketsDAO } from "../dao/factory.js";
import { TicketDTO } from "../dto/ticket.dto.js";
import { CheckoutsServiceError, TicketDTOERROR } from "../services/errors.service.js";


const ticketsDAO = new TicketsDAO()

export class TicketsRepositories{

    //Si no hay consulta devuelve todos los tickets.
    async getAllTickets(){
        //Hace la busqueda en a BD y devuelve el array de dto ya hecho x el dao correspodiente
        try {
            const ticketsList = await ticketsDAO({}) 
            return ticketsList
        } catch (error) {
            if (error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
            else throw CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|TicketsRepositories.getAllTickets.|','Error interno del servidor.') 
        }
    }

    async getTicketById(ticketId){
        //Hace la busqueda en a BD y devuelve el array de dto ya hecho x el dao correspodiente
        try {
            const ticketsList = await ticketsDAO({ticketId:ticketId}) 
            if (ticketsList.length <1 ) throw new CheckoutsServiceError(CheckoutsServiceError.GET_TICKET_ERROR,'|TicketsRepositories.getTicketById|','No existe ticket con este ID')
            return ticketsList[0]
        } catch (error) {
            if (error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
            else throw CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|TicketsRepositories.getTicketById.|','Error interno del servidor.') 
        }
    }

  
    async getTicketByCode(code){
        //Hace la busqueda en a BD y devuelve el array de dto ya hecho x el dao correspodiente
        try {
            const ticketsList = await ticketsDAO({code:code}) 
            if (ticketsList.length <1 ) throw new CheckoutsServiceError(CheckoutsServiceError.GET_TICKET_ERROR,'|TicketsRepositories.getTicketByCode|','No existe ticket con este code')
            return ticketsList[0]
        } catch (error) {
            if (error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
            else throw CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|TicketsRepositories.getTicketByCode.|','Error interno del servidor.') 
        }
    }

    async getTicketsByPurchaser(code){
        //Hace la busqueda en a BD y devuelve el array de dto ya hecho x el dao correspodiente
        try {
            const ticketsList = await ticketsDAO({purchaser:purchaser}) 
            if (ticketsList.length <1 ) throw new CheckoutsServiceError(CheckoutsServiceError.GET_TICKET_ERROR,'|TicketsRepositories.getTicketsByPurchaser|','No existen tickets para este comprador...')
            return ticketsList[0]
        } catch (error) {
            if (error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
            else throw CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|TicketsRepositories.getTicketsByPurchaser.|','Error interno del servidor.') 
        }
    }



    async createTicket({purchaser,detailsList}){
        try {
            //Recibo la detail list y calculo el total desde ahi
            let ticketPrice = 0
            detailsList.forEach(item => ticketPrice = Number(ticketPrice) + Number(item.subtotalPrice))
            const createdTicket = await ticketsDAO.create({
                price: ticketPrice,
                detailsList:detailsList,
                purchaser:purchaser
            })

            //Por implementacion de DAO lanza error si hay problemas en la creaciomn y se va x catch
            return createdTicket
           
        } catch (error) {
            if (error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
            else throw CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|TicketsRepositories.createTicket.|','Error interno del servidor.') 
        }
    }


    async updateTicketPayLink({ticketCode,ticketLink}){
        //Va a insertar el linck de pago en el ticket
    }

    async markAsPaid({ticketCode,moment}){
            //Va a marcar como pagada la compra cujandol ingrese el pago
    }
    
}