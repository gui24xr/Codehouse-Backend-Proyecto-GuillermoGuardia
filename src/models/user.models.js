
import mongoose from "mongoose"

const userSchema =  mongoose.Schema({
    first_name: {
        type:String,
        required:true
    },
    last_name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        index: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    role:{
        type: String,
        enum: ["admin", "user","premium"], //Enumera los roles permitidos
        default: "user", //Asignamos por default "user"
        required: true,
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        default: null
       
    },
    last_connection:{
        type: Date,
        default: null
    },
    documents:[{
        name:{
            type: String,
        },
        reference:{
            type:String,
        }
    }]


})

export const UserModel = new mongoose.model('users',userSchema)

