import mongoose from "mongoose"
import shortid from "shortid"

const collectionName = 'tickets'

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        unique:true,
        required: true,
        default: shortid.generate
    },
    purchaseDateTime: {
        type: Date,
        default: Date.now 
    },
    price: { 
        type: Number,
        required: true
    },
  
    detailsList:[{
    }],

    purchaser: { //Usaremos el email
        type: String,
        required: true,
    },
    payLink: { //Link de pago
        type: String,
    },
    paymentDateTime: {
        type: Date,
        default: null
    },


});

export const TicketModel = new mongoose.model(collectionName,ticketSchema)