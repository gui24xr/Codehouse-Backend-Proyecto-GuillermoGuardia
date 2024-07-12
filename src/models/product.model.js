import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'
import { isEmail } from "../utils/helpers.js"

const collectionName = 'products'

const productSchema = new mongoose.Schema({
    brand: { 
        type:String,
        default: null,
    },
    title: { 
        type:String,
        required: true,
    },
    description: { 
        type:String,
        default: null
    },
    price: { 
        type:Number,
        required: true
    },
    img: { 
        type:String,
    },
    code: { 
        type:String,
        required: true,
    },
    category: { 
        type:String,
        required: true
    },
    stock: { 
        type:Number,
        default: 0
    },
 
    status: { 
        type:Boolean,
        default: true
    },
    thumbnails: { 
        type:[String],
        default:[]
    },
    owner: {
        type: String,
        default: 'admin',
        validate: {
            validator: (value) => {
                if ((value === 'admin') || 
                    (isEmail(value))) return true
                else return false
            },
            message: props => `${props.value} no es un email.`
        }

    }, 
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    
})



//Le agrego el plugin para paginate.
productSchema.plugin(mongoosePaginate)
//creo y exporto la clase con la cual voy a interacturar con la coleccion.
export const ProductModel = new mongoose.model(collectionName,productSchema)