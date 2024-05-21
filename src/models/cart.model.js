import mongoose from "mongoose";

const collectionName = 'carts'

const cartSchema = new mongoose.Schema({
    products:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity:{
            type: Number,
            required:true
        }
    }]
})


// Agrego Método toJSON para transformar la salida
cartSchema.methods.formatToOutput = function() {
    const cart = this.toObject();
    cart.id = cart._id.toString();
    delete cart._id;
    delete cart.__v;
    return cart;
};


//creo y exporto la clase con la cual voy a interacturar con la coleccion.
export const CartModel = new mongoose.model(collectionName,cartSchema)
