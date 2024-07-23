import { CartModel } from "../../models/cart.model.js"
import { CartDTO } from "../../dto/carts.dto.js"
import { CartsServiceError, CartDTOERROR, } from "../../services/errors.service.js"



export default class CartsMongoDAO{


    //FUNCION INTERA PARA CONSTRUIR EL CARTDTO.    
    //Construye el objeto que necesita enviarle a la clase  CARTDTO la instancia CartDTO correspondiente.
    //La construyer respetando sus requerimientos ya que a futuro si hay otro tipo de BD el resto de la aplicacion se olvida que BD usa
    //Por lo cual getCartDTO es diferente en cada DAO segun la BD que use.
    getCartDTO(cartFromDB){
        return new CartDTO({
          
            cartId: cartFromDB._id.toString(), 
            products: cartFromDB.products.map( item => (
                {                
                    quantity:item.quantity,
                    product:{
                        productId : item.product._id.toString(),
                        title: item.product.title,
                        description: item.product.description,
                        price: item.product.price,
                        img: item.product.img,
                        code: item.product.code,
                        category: item.product.category,
                        owner: item.product.owner,
                        stock: item.product.stock,
                        status: item.product.status,
                        thumbnails: item.product.thumbnails
                        
                    }
                        
                }
            
            ))})}
                

        
    

    validateProductList(productList) {
        // Verificar si productList no es un array o si es un array vacío
        if (!Array.isArray(productList)) {
            return false; // No es un array, devuelve falso
        }
    
        // Si es un array vacío, devuelve verdadero
        if (productList.length === 0) {
            return true;
        }
    
        // Iterar sobre cada elemento de productList
        for (let item of productList) {
            // Verificar que cada elemento tenga las propiedades product y quantity
            if (!item.hasOwnProperty('product') || !item.hasOwnProperty('quantity')) {
                return false; // Elemento no tiene las propiedades necesarias, devuelve falso
            }
    
            // Verificar que product sea de tipo string y quantity sea de tipo number
            if (typeof item.product !== 'string' || typeof item.quantity !== 'number') {
                return false; // Tipos de datos incorrectos, devuelve falso
            }
        }
    
        // Si todas las validaciones pasan, retornar true
        return true;
    }
    

    
    async create({productsList}){
        //Recibe un objeto con la lista de productos a ingresar.
        //Si el objeto viene vacio crea un carro vacio.
        //Crea un carro con la lista de productos que recibe, la cual es pasada por una validacion para pedir el formato solicitado.
        //Si no pasaron por parametro una productsList entonces crea el carro vacio
        //Si la lista vino vacio
        try{
            //SI viene lista de productos hay que validar que sea un array vacio o que sus elementos sean del formato esperado, si no lo son, entonces lanzo error.
            if (productsList){
                if (!this.validateProductList(productsList)) throw new CartsServiceError(CartsServiceError.INVALID_PRODUCTS_LIST,'CartsMongoDao.create',`La lista de productos ingresada no tiene un formato esperado...`)
            }
            //Si llegamos hasta aca es xq si hay lista de productos en parametro es valida, pero si nos pasaron nada creamos una lista vacia.
            const newCart = new CartModel({products: productsList || []})
            await newCart.save() // Lo guardo
            //Ya que nuestro metodo getCartDTO necesita la informacion del producto en el carro para enviar tambien, necesitamos
            // Pedir a la BD el registro creado pero con populate.
            const createdCart = await CartModel.findOne({_id:newCart._id}).populate('products.product')
            return this.getCartDTO(createdCart)
        }catch(error){
            if (error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.CREATE_ERROR,'CartsMongoDao.create','Error al crear carro...')
        }
    }

    
    async get({cartId}){
        //Recibe un objeto con el cartId de la BD
        //Si no redcibe cartId devuelve toda la coleccion entera
        try{
            const cartsArray = await CartModel.find(cartId ? {_id:cartId} : {}).populate('products.product')
            //Tengo el array con coincidencias, y quiero devolver lista de DTO
            const cartsDTOArray = cartsArray.map( cartItem => (this.getCartDTO(cartItem)))
            console.log(cartsArray)
            return cartsDTOArray
        }catch(error){
            if (error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.GET_ERROR,'|CartsMongoDAO.get|',error.message)
        }
    }

  
   
    async update({cartId,productsList}){
        //Recibe un objeto con el cartId a actualizar y la nueva lista de productos del carro para ser reemplazada.
        //Hay que deocumentar que el filter debe venir el id del cart a actualizar y la productList valida en la propiedad productList
        //Los carts solo tienen la lista de productos para modificar x lo cual recibe una lista de productos, la valida
        //La recorre y va haciendo el update segun esa lista.
        //Devuelve el dto con el carro modificado.
        try{
            //SI la lista no es valida lanzamos la excepcion
            if (!this.validateProductList(productsList)) throw new CartsServiceError(CartsServiceError.INVALID_PRODUCTS_LIST,'CartsMongoDao.update',`La lista de productos ingresada no tiene un formato esperado...`)
            // Pongo la lista de productos
           
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cartId },
                { products: productsList },//Objeto con lo que hay que actualizar
                { new: true } // Para devolver el documento actualizado
            ).populate('products.product')
            // Devuelvo el dto de lo actualizado. Si no existe el carro devuelve null por lo cual habria que lanzar excepcion de carro no existe
            if (!updatedCart) throw new CartsServiceError(CartsServiceError.UPDATING_ERROR,'CartsMongoDAO.update','No se encontro el carro para actualizar...')
            return this.getCartDTO(updatedCart)
        
        }catch(error){
            if (error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.UPDATING_ERROR,'|CartsMongoDAO.update|',error.message)
        }
    }


    async delete({cartId}){
        //Borra el carro cartId de la base de datos y si no lo borra lanza un error informativo
        try{
            const deleteResult = await CartModel.deleteOne({_id:cartId})
            //Esta funcion me devuelve la informacion del proceso de eliminado la leo y de acuerdo  eso devuelvo, true o false.
            if (deleteResult.deletedCount == 0) {
                throw new CartsServiceError(CartsServiceError.DELETING_ERROR,'|CartsMongoDAO.delete|',`No se pudo eliminar cartId ${cartId}...`) 
            }

        }catch(error){
            if (error instanceof CartDTOERROR) throw error
            else throw new CartsServiceError(CartsServiceError.DELETING_ERROR,'|CartsMongoDAO.delete|',error.message) 
        }
    }


   
}