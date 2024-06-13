import mongoose from "mongoose";

const collectionName = 'preorders';

export const PreOrderModel = mongoose.model(collectionName, preOrderSchema)

const preOrderSchema = mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String
    },
    cart:{   //Igual que users, creo un cart para esta compra y listo.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        default: null
       
    },
    payment: {
       paymentId: {
        type: String,
        default:null
        },
        paymentMethod: {
        type: String ,
        defaul:null 
        },
        receivedAt: {
        type: Date,
        defaul:null  
        }

    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],  // Estados posibles de la pre order
        default: 'pending'  // Estado por defecto
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
})


