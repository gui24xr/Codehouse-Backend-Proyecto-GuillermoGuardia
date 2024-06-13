import mongoose from "mongoose";


const collectionName = 'purchases';

// Definición del esquema de Mongoose para la colección de compras
const purchaseSchema = mongoose.Schema({
    purchaser: {
        type: mongoose.Schema.Types.Mixed,  
        refPath: 'purchaserType',  
        required: true
    },
    purchaserType: {
        type: String,
        required: true,
        enum: ['users', 'preorders']  
    },
    shippingAddress: {
        type: String,
        required: function() {
            return this.deliveryMethod === 'shipping';
        },
        validate: {
            validator: function(value) {
                if (this.deliveryMethod === 'shipping' && !value) {
                    return false; // shippingAddress es requerido si deliveryMethod es 'shipping'
                }
                if (this.deliveryMethod === 'pickup' && value) {
                    return false; // shippingAddress no debe ser proporcionado si deliveryMethod es 'pickup'
                }
                return true;
            },
            message: props => `Invalid shippingAddress for delivery method: ${props.value}`
        }
    },
    phone: [{   //Array de telefonos xq se puede tener mas de uno
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Expresión regular para validar números, espacios y caracteres + o -
                return /^[0-9 +\-]*$/.test(v);
            },
            message: props => `${props.value} no es un número de teléfono válido.`
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
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tickets',  // Referencia al ticket asociado a la compra
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Creación del modelo Purchase basado en el esquema purchaseSchema
export const PurchaseModel = mongoose.model(collectionName, purchaseSchema);
