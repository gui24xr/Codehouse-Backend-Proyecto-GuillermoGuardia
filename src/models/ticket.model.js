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
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now // No se necesita () aquí, solo se referencia la función Date.now
    },
    
    price: { 
        type: Number,
        required: true
    },

   //Detalles del ticket. //quitar cuando genere el neuevo modelo
    details:[{
    }],

    purchaser: {
        type: mongoose.Schema.Types.Mixed,
        refPath: 'purchaserType',
        required: true
    },
    purchaserType: {
        type: String,
        required: true,
        enum: ['users', 'preorders']
    }

});

export const TicketModel = new mongoose.model(collectionName,ticketSchema)