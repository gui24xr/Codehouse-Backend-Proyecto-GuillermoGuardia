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
    orderList:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity:{
            type: Number,
            required:true
        }
    }],
    payment: {
       paymentId: {
        type: String,
        default:null
        },
        paymentMethod: {
        type: String ,
        default:null 
        },
        receivedAt: {
        type: Date,
        default:null  
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


