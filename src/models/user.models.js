
import mongoose from "mongoose"

const userSchema =  mongoose.Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
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
    cartId:{
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
    lastConnection:{
        type: Date,
        default: null
    },
    recoveryPasswordCode:{
       type: 'String',
       default: null
    },
    recoveryPasswordExpiration:{
        type: Date, 
        default: null
    },
    documents:[{
        docName:{
            type: String,
        },
        docReference:{
            type:String,
        }
    }]


})

export const UserModel = new mongoose.model('users',userSchema)

