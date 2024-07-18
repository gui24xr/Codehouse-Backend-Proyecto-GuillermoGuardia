import { TicketModel } from "../../models/ticket.model.js"
import { TicketDTO } from "../../dto/ticket.dto.js"
import { CheckoutsServiceError, TicketDTOERROR } from "../../services/errors.service.js"
//Tickets pertenece al servicio de checkut x lo tanto lanzara errores de checkout

export default  class TicketsMongoDAO{

    getTicketDTO(ticketFromDB){
        //Retorna el dto del Ticket desde la base de datos. En este caso uso mongo asqieu transfromara segun los resultados vienen de mongo.
        return new TicketDTO({
            ticketId:ticketFromDB._id.toString(),
            code:ticketFromDB.code,
            purchaseDateTime:ticketFromDB.purchaseDateTime,
            price:ticketFromDB.price,
            detailsList:ticketFromDB.detailsList,
            purchaser:ticketFromDB.purchaser,
            payLink:ticketFromDB.payLink,
            paymentDateTime:ticketFromDB.paymentDateTime,
           
        })
    }




async create({price,detailsList,purchaser}){
    //Crea un ticket en mongo y devuelve su dto.
    try{
        const newTicket = new TicketModel({
            price: 24,price,
            detailsList: detailsList,
            purchaser: purchaser
        })
        await newTicket.save()
        return this.getTicketDTO(newTicket)
    }
    catch(error){
        console.log(error)
        if (error instanceof TicketDTO) throw error
        else throw new CheckoutsServiceError(CheckoutsServiceError.CREATE_TICKET_ERROR,'|TicketsMongoDAO.create|','Error al crear ticket.')
    }
}



async get({code,purchaser,ticketId}){
    //Retorna la lista de tickets encontrados segun criterio de busqueda y si no devuelve []
    try{
        let ticketsList = []
        let query = {}
        
        code && (query.code = code)
        ticketId && (query._id = ticketId)
        purchaser && (query.purchaser = purchaser)

        const findResult = await TicketModel.find(query)

        if (findResult.length > 0){
            ticketsList = findResult.map(item => (this.getTicketDTO(item)))
        }

        return ticketsList

    }catch(error){
        if (error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
        else throw CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|TicketsMongoDAO.get|','Error interno del servidor.') 
    }
}


async updateTicketByCode(code,{paymentLink,paymentDateTime}){
    try{

        //Traigo el ticcket de la base de datos
        const searchedTicket = await TicketModel.findOne({code:code})
        //Lanzo error si no hay ticket o datos que modificar o son incorrectos.
        if (!paymentLink || !paymentDateTime || !searchedTicket)  throw new CheckoutsServiceError(CheckoutsServiceError.UPDATE_TICKET_ERROR,'|TicketsMongoDAO.UpdateTicketByCode|','No existe el codigo de ticket o no se enviaron datos para modificar.')
        
        //Si todo sale ok preparo la operacion de actualizacion
        paymentLink && (searchedTicket.paymentLink = paymentLink)
        paymentDateTime && (searchedTicket.paymentDateTime)
        //Modifico en la base de datos.
        await searchedTicket.save()
        //Devuelvo el dto
        return this.getTicketDTO(searchedTicket)
    }catch(error){
        if (error instanceof CheckoutsServiceError || TicketDTOERROR) throw error
        else throw CheckoutsServiceError(CheckoutsServiceError.INTERNAL_SERVER_ERROR,'|TicketsMongoDAO.updateTicketByCode|','Error interno del servidor.') 
    }
}




}