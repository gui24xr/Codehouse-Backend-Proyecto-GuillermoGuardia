
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
    enabled:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    last_connection:{
        type: Date,
        default: null
    },
    recovery_password_info:{
        code: {type: 'String',default: null},
        expiration:{type: date, default: null}
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

