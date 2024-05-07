import { configSessionFileStorage } from "../config/sessions-config.js"
import { ProductModel } from "../models/product.model.js"


export class MongoProductsDAO{
   
    async getProducts(){
        try {
            const products = await ProductModel.find()
            return products
        } catch (error) {
            throw new Error('Error al obtener productos...')
        }
   }

   async getProductById(productId){
         try {
            const searchedProduct = await ProductModel.findById(productId)
            if (!searchedProduct) return null
            return searchedProduct._doc
        } catch (error) {
            throw new Error('Error al intentar obtener producto...')
        }

   }

   async getProductStock(productId){
    try {
       const searchedProduct = await ProductModel.findById(productId)
       if (!searchedProduct) return null
       return searchedProduct._doc.stock
   } catch (error) {
       throw new Error('Error al intentar obtener producto...')
   }

}
   //Solamente modifica el stock...
   //SI el stock pasar a ser cero al ser modificado entonces el status pasara a inactivo/false.
   //Stock en cero producto inactivo, stock distinto de cero el producto puede, o no ,estar activo.
   async updateProductStock(productId,newStockQuantity){
    
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: { stock: newStockQuantity } }, 
            { new: true }
        )
        if (!updatedProduct) {
            console.log('Producto no encontrado...');
            return {isSuccess: false,
                    message: `No existe producto con id${productId}.`
                }
        }
        //Aca modificamos el state una vez modificado el stock.
        if (updatedProduct.stock == 0 ) updatedProduct.status = false
        updatedProduct.save()
        //Retornadmos
        return {
            isSuccess: true,
            message: `Se edito el producto con id${productId}.`,
            updatedProduct
        }
    } catch (error) {
        throw new Error('Error al intentar actualizar  stock producto...')
    }
   }

   


   async updateProduct(productId,newProduct){
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, newProduct, { new: true });
        if (!updatedProduct) {
            console.log('Producto no encontrado...');
            return {isSuccess: false,
                    message: `No existe producto con id${productId}.`
                }
        }
        return {
            isSuccess: true,
            message: `Se edito el producto con id${productId}.`,
            updatedProduct
        }
    } catch (error) {
        throw new Error('Error al intentar actualizar producto...')
    }
   }

   async deleteProduct(productId){
     try {
        const deletedProduct = await ProductModel.findByIdAndDelete(productId) 
        if (!deletedProduct){
            console.log('Producto no encontrado...');
            return {
                isSuccess: false,
                message: `No existe producto con id${productId}.`
            }
        }
        return {
            isSuccess: true,
            message: `Se elimino producto con id${productId}.`
        }
        }  catch (error) {
        throw new Error('Error al intentar eliminar producto...')
    }
   }

   async getProductsPaginate(limit,page,sort,filter){
    try {
      const options = {}
      if (limit !== undefined) {
        options.limit = limit;
    }
      
      let products = await ProductModel.paginate(filter,options)
      return products

    } catch (error) {
      console.log('Error al recuperar los productos...')
      throw error
    }
  }


  async getProductsByFilter(filter,pageSize,pageNumber){
    try {
        //Devuelve los productos filtrados, la cantidad de registros,numeros de pagina anterior , numero de registros por pagina
        //Es una alternativa  a paginate
        if (!pageSize) pageSize = 0
        const totalProducts = await ProductModel.countDocuments()
        const matchesQuantity = await ProductModel.countDocuments(filter)
        const matches = await ProductModel.find(filter).skip((pageNumber-1)*pageSize).limit(pageSize)
        
        const filteredData = {
            products:matches,
            pageSize: pageSize,
            pageNumber:pageNumber,
            matches: matches,
            totalMatches: matchesQuantity,
            totalProducts: totalProducts

        }
        
        return filteredData
      
    } catch (error) {
      console.log('Error al intentar getproductsFilter...')
      throw error
    }
  }

      //Esta funcion agrega el producto y retorna el producto recien agregado. Retorna un objeto asi:
    //{success: true/false, message: '',product: producto Agregado}
    //Si producto no fue agregado devuelve null
    async addProduct({title, description,price,img,code,category,stock,status,thumbnails}){
        //console.log('En DAO: ', title, description,price,img,code,category,stock,status,thumbnails)
        try{
            //Comprobamos que vengan todos los campos en los parametros
            if (!title || !description || !price|| !img || !code ||  !category || !stock || !status|| !thumbnails){
                console.log('Es necesario ingresar todos los campos...')
                return {success: false, message: 'Es necesario ingresar todos los campos...',product: null}
            }
            //Busco que el producto no exista.
            //console.log('Existe code: ', code)
            const existProduct = await ProductModel.findOne({code:code})
            //console.log('Existe: ', existProduct)
            if (existProduct){
                //Si el codigo existe no agrego entonces salgo de la funcion enviando un mensaje a quien invoco
                console.log('Existe un producto con este codigo...')
                return {
                    success: false, 
                    message:  `El producto no fue agregado. Ya existe un producto con codigo ${code}`,
                    product: null
                }
            }
            //Si no existe procedemos a agregarlo.
            const nuevoProducto = new ProductModel({title, description,price,img,code,category,stock,status,thumbnails})
            nuevoProducto.save()
            //guarde el producto en la base de Datos ahora mando msg de OK
            return {
                success: true, 
                message:`Se guardo en la BD el producto enviado bajo el id ${nuevoProducto.id}`,
                product:nuevoProducto._doc
            }
        }catch(error){
            res.status(500)
        }
    }
    
    async changeProductStatus(productId){
        try{
            const searchedProduct = await ProductModel.findById(productId)
            if (!searchedProduct) {
                console.log('Producto no encontrado...');
                return {success: false,
                        message: `No existe producto con id${productId}.`
                        }
            }
            if ( searchedProduct.status == true ) searchedProduct.status = false
            else searchedProduct.status = true
            //searchedProduct.marks('products')
            searchedProduct.save()
            return {
                success: true,
                message: `Se cambio el estado del producto con id${productId}.`,
                searchedProduct
            }
        }catch(error){
            throw new Error(`Error al intentar cambiar estado a producto ${productId} desde mongoDao...`)
        }
    }

    async getProductsCategoriesList(){
        //Devuelve un string de objetostodas las diferentes categorias del catalogo de productos.
        try{
            const products = await this.getProducts()//Obtenemos el array.
            const categoriesSet = new Set();

        products.forEach(item => {
                categoriesSet.add(item.category)
            });

        const arrayCategories = Array.from(categoriesSet)
        const arrayWithInfo = []
       
        //Voy a transformar en objeto que sea {categoryName: nombre, quantityInCategory: x}
        arrayCategories.forEach( categoryItem => {

                let categoryQuantity = 0
                let categoryQuantityStatusActive = 0
                products.forEach( item => {
                    if (item.category == categoryItem) categoryQuantity +=1
                    if ((item.category == categoryItem) && item.status==true) categoryQuantityStatusActive +=1
                })
                arrayWithInfo.push({ categoryName: categoryItem,quantity: categoryQuantity, activeQuantity:categoryQuantityStatusActive})
        })
        //console.log('Array with info: ', arrayWithInfo)
        return arrayWithInfo
          
        }catch(error){
            throw new Error(`Error al intentar obtener lista de categorias desde mongoDao...`)
        }
    }



}