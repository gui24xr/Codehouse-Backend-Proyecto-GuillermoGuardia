import {CartModel} from '../models/cart.model.js'
import { InternalServerError,CartsServiceError } from '../services/errors/custom-errors.js'


/*
Cada vez que este repositorio devuelva un carro lo va a devolver ya proceesado por la accion de la funcion que agregue para formatear en el modelo
De esa manera limpiamos __v, ya traemos id en vez de _id
Y a su vez antes de devolverlo se agregaran los campos que dan cantidad de producto y monto del carro.

"cart": {
        "products": [],
        "id": "66450823eee3a0e616f3bf46",
        "countProducts": 0,
        "cartAmount": "0.00"
    }
*/



export class CartRepository {

    async createCart(){
        try{
            const newCart = new CartModel({products:[]})
            await newCart.save()
            return newCart
        }catch(error){
          
            throw new CartsServiceError(CartsServiceError.CREATE_ERROR,`Error al intentar crear el carrito`)
        }
    }

 
    //Devuelve un objeto con cantidad de objetos en el carro
    //Este metodo es interno de la clase para tener informacion a mano...
    #countProducts(cart){
        //Calcula la cantidad de productos en el carro.
        let productsQuantity = 0
        cart.products.forEach( item => productsQuantity = productsQuantity + item.quantity)
        return productsQuantity
        
    }

    #cartAmount(cart){
        //Devuelve el total de productos en el carrito.
        let amount = 0
        cart.products.forEach( item => amount = amount + ( item.product.price * item.quantity))
        return amount.toFixed(2)
    }



    async getCartById(cartId){
        try {
            const searchedCart = await CartModel.findById(cartId).populate('products.product')
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`No existe carrito con ID${cartId}`)
            return {
                    ...searchedCart.formatToOutput(),
                    countProducts:this.#countProducts(searchedCart),
                    cartAmount:this.#cartAmount(searchedCart)
                } 
                 
        } catch (error) {
           if (error instanceof CartsServiceError) throw error
           else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.getCartById||...')
        }
    }


    async getProductsInCart(cartId){
        try {
            const searchedCart = await CartModel.findById(cartId).populate('products.product')
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`No existe carrito con ID${cartId}`)
            return searchedCart.products    
        } catch (error) {
            if (error instanceof CartsServiceError) throw error
           else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.getProductsInCart||...')
        }
    }



    

    async addProductInCart(cartId,productId,quantity){
        try {
            //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
            const searchedCart = await CartModel.findById(cartId)
            //Si no exist el carrito salgo devolviendo null
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`No existe carrito con ID${cartId}`)
            //Si el carrito existe veo si el producto esta o no esta.
            const existProductInCart = searchedCart.products.some(item => item.product._id == productId )
            if (!existProductInCart){
                if (quantity) searchedCart.products.push({product:productId,quantity:quantity})
                else searchedCart.products.push({product:productId,quantity:1})
            }
            else{
                const position = searchedCart.products.findIndex(item => item.product._id == productId  )
                //Si me pasaron cantidad por parametro pongo esa cantidad, si no, solo agrego uno.
                !quantity ? searchedCart.products[position].quantity +=1 :  searchedCart.products[position].quantity += quantity
            }
            //Recuento la cantidad de productos en el carrito xq la devolvere como informcion adicional 
            searchedCart.markModified("carts") 
            await searchedCart.save()//Guardo en BD
              return {
                    ...searchedCart.formatToOutput(),
                    countProducts:this.#countProducts(searchedCart),
                    cartAmount:this.#cartAmount(searchedCart)
                } 
        } catch (error) {
            if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.AddProductInCart||...')
        }
    }



    //Si el producto existe en el carro entonces lo elimina y devuelve el carro actualizado.
    async deleteProductInCart(cartId,productId){
        try {console.log('LLego: ',cartId, productId)
            const searchedCart = await CartModel.findById(cartId)
            //No Existe el carro, me voy....
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`No existe carrito con ID${cartId}`)
            //Existe el producto en el carro?
            const existProductInCart = searchedCart.products.some(item => item.product.toString() == productId )
            //No Existe el producto en el carro me voy....
            if(!existProductInCart) throw new CartsServiceError(CartsServiceError.PRODUCT_NO_DELETED,`No existe el producto ${productId} en carrito con ID${cartId}`)
           
            //Existe el producto en el carro, procedo.
            const position = searchedCart.products.findIndex(item => item.product.toString() == productId )
            searchedCart.products.splice(position,1)
            searchedCart.markModified("carts")
            await searchedCart.save()
            return {
                ...searchedCart.formatToOutput(),
                countProducts:this.#countProducts(searchedCart),
                cartAmount:this.#cartAmount(searchedCart)
                }
        } catch (error) {
            if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.deleteProductInCart||...')
        }
    }




    async addProductsListInCart(cartId,productsList){
        try {
            //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
            const searchedCart = await CartModel.findById(cartId)
            //Si no exist el carrito salgo devolviendo null
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`No existe carrito con ID${cartId} por lo cual no se pueden agregar productos...`)
            //Si el carrito existe recorro el array y voy actualizando el array Products
             productsList.forEach( item => {
                const existProductInCart = searchedCart.products.some(productItem => productItem.product.toString() == item.productId )
                if (existProductInCart){
                    console.log('Existe el producto con ese ID actualizaremos su cantidad...')
                    const position = searchedCart.products.findIndex(productItem => productItem.product.toString() == item.productId )
                    //Si me pasaron cantidad por parametro pongo esa cantidad, si no, solo agrego uno.
                   searchedCart.products[position].quantity += item.quantity
                    }
                else{//Si el carro no tiene este producto le creo el item con la cantidad
                    searchedCart.products.push({product:item.productId,quantity:item.quantity})
                } 
            })
            //Actualice todo el array ahora guardo,Actualizo en la BD y retorno.
           searchedCart.markModified("carts")
           await searchedCart.save()
           return {
            ...searchedCart.formatToOutput(),
            countProducts:this.#countProducts(searchedCart),
            cartAmount:this.#cartAmount(searchedCart)
        } 
        } catch (error) {
             if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.deleteProductInCart||...')
        }
    }



    async clearCart(cartId){
         try {
            //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
            const searchedCart = await CartModel.findById(cartId)
            //Si no exist el carrito me voy al throw para devolver el error.
            if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`Imposible eliminar, No existe carrito con ID${cartId}`)
            //Si existe limpio el array de productos.
            searchedCart.products = [] //vacio el array y actualizo BD.
            searchedCart.markModified("carts") //Actualizo en la BD
            await searchedCart.save()
            //Retorno el carro modificado.
            return {
                ...searchedCart.formatToOutput(),
                countProducts:this.#countProducts(searchedCart),
                cartAmount:this.#cartAmount(searchedCart)
            } 
           } catch (error) {
            if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.AddProductInCart||...')
           }

    }

    async countProductsInCart(cartId){
        try {
               //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
               //console.log('Entro el ID: ', cartId)
               const searchedCart = await CartModel.findById(cartId)
               //Si no exist el carrito salgo devolviendo null
              //Si no exist el carrito me voy al throw para devolver el error.
                if(!searchedCart) throw new CartsServiceError(CartsServiceError.NO_EXIST,`Imposible eliminar, No existe carrito con ID${cartId}`)
                
                let productsQuantity = 0
                searchedCart.products.forEach( item => productsQuantity = productsQuantity + item.quantity)
                return productsQuantity

        } catch (error) {
            if (error instanceof CartsServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||cartsRepository.countProductsInCart||...')
        }
    }
}