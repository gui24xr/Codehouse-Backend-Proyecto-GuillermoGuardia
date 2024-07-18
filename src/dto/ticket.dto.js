
import { TicketDTOERROR } from "../services/errors.service.js"


export class TicketDTO{

    constructor(receivedTicket){
        //Debe recibir un Ticket con las propiedades detalladas.
        this.ticketId = receivedTicket.ticketId;
        this.code = receivedTicket.code;
        this.purchaseDateTime = receivedTicket.purchaseDateTime 
        this.price = receivedTicket.price;
        this.detailsList = receivedTicket.detailsList;
        this.purchaser = receivedTicket.purchaser;
        this.payLink = receivedTicket.payLink;
        this.paymentDateTime = receivedTicket.paymentDateTime; 
       
    }
}