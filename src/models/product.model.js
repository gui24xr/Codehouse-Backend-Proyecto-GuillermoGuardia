import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'
import { isEmail } from "../utils/helpers.js"

const collectionName = 'products'

const productSchema = new mongoose.Schema({
    title: { 
        type:String,
        required: true
    },
    description: { 
        type:String,
        required: true
    },
    price: { 
        type:Number,
        required: true
    },
    img: { 
        type:String,
        required: true
    },
    code: { 
        type:String,
        required: true,
        unique:true
    },
    category: { 
        type:String,
        required: true
    },
    stock: { 
        type:Number,
        required: true
    },
 
    status: { 
        type:Boolean,
        required: true
    },
    thumbnails: { 
        type:[String],
        default:[]
        //required: true
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
    
})



//Le agrego el plugin para paginate.
productSchema.plugin(mongoosePaginate)
//creo y exporto la clase con la cual voy a interacturar con la coleccion.
export const ProductModel = new mongoose.model(collectionName,productSchema)