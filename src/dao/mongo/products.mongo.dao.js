
import { trusted } from "mongoose"
import { ProductDTO } from "../../dto/products.dto.js"
import { ProductModel } from "../../models/product.model.js"


export class MongoProductsDAO{
   
    //Devuelve un array con todos los productos.
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

   //Esto ira a servicios
   async getProductStock(productId){
    try {
       const searchedProduct = await ProductModel.findById(productId)
       if (!searchedProduct) return null
       return searchedProduct._doc.stock
   } catch (error) {
       throw new Error('Error al intentar obtener producto...')
   }

}

    //ESTO LO HARE EN SERVICE TRABAJANDO SOBRE EL DTO Y ENVIANDOLO
    //Y USANDO EL METODO UPDATE DEL REPOSITORY
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

   

   //rECICE EL DTO PROCESADO
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
            totalProducts: totalProducts,
            pagesQuantity: Math.ceil(matchesQuantity / pageSize)

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



    //--------- NUEVO DAO DESDE ACA -------------------------------------------------//
    //--------- NUEVO DAO DESDE ACA -------------------------------------------------//
    //--------- NUEVO DAO DESDE ACA -------------------------------------------------//
    //--------- NUEVO DAO DESDE ACA -------------------------------------------------//
    //--------- NUEVO DAO DESDE ACA -------------------------------------------------//


    getProductDTO(productFromDB){
        //Retorna el dto del product desde la base de datos. En este caso uso mongo asqieu transfromara segun los resultados vienen de mongo.
    
        return new ProductDTO({
            productId:productFromDB._id.toString(),
            brand:productFromDB.brand,
            title:productFromDB.title,
            description:productFromDB.description,
            price:productFromDB.price,
            img:productFromDB.img,
            code:productFromDB.code,
            category:productFromDB.category,
            owner:productFromDB.owner,
            stock:productFromDB.stock,
            status:productFromDB.status,
            createdAt:productFromDB.createdAt,
            thumbnails:productFromDB.thumbnails,
        })
    }

    async createProducts(productsList){
        //Toma una lista, crea los productos todos juntos y devuelve una lista con los productDTO creados.
        //Cada elemento de productsList debe contar con los siguientes campos:
        //{title,description,price,img,code,category,owner,stock,status,thubnails} Si una propiedad no esta entonces se le da un valor por default
        //Si ya hay un producto con el mismo code para el onwer el producto no sea crea.
        //campos obligatorios: titulo, price, code,category,stock
        //Si stock es cero, status sera false, si es stock es mayor a cero sera true, o sea estara activada para venderse.
        //Se deveulve la lista de productDTO creados y otra lista con los code de los no creados.
        try{
            //Primero mapeo a productsList para tener una lista valida para mandar a crear
            //la validacion de los productos nuevos sera responsabilidad de la capa de servicios y repositorio
            //La regla sera que psi hay un codigo repetido para un owner deteminado entonces no se guarda xq ese owner ya tiene un producto con ese code
            //los code se pueden repetir para la base de datos pero no para un owner determinado
            const newProducts = productsList.map( item => (
               { 
                title : item.title,
                description: item.description || null,
                price : item.price,
                img: item.img || null, //Aca hay que poner una imagen de producto por defecto
                code: item.code,
                category: item.category,
                owner: item.owner || 'admin',
                stock: item.stock,
                status: item.stock > 0 ? true : false,
                thubnails: item.thumbnails || [] //SI no hay thubnails se guarda un array vacio.
               }
            ))
            //console.log('Lista new Products: ', newProducts)
            

            const createdProducts = await ProductModel.insertMany(newProducts)
            const productsDTOList =    createdProducts.map(item => (this.getProductDTO(item)))
            return productsDTOList
        }catch(error){
            console.log('erroorrrrr',error)
        }
    }

    
    async get({productId,owner,status,code,brand,category,createdAt}){
       //Devuelve un array con productDTO que coincida la busqueda.
       //Se puede combinar los parametros para hacer el get.
       //Si no se pasa ninguna propiedad, o sea {} devuelve todos los productos.
       //Todas las propiedades se comparan por igualdad excepto createdAT que se devuelve los anterior igual a la fecha ingresada.
       try{
          const query = {}
          
          //Voy construyendo el objeto de consulta de acuerdo a si estan o no los parametros.
          productId && (query._id = productId)
          owner && (query.owner = owner)
          status !== undefined && (query.status = status) // Como puede ser true o false hay que probar que no sea undefined o null
          code && (query.code = code)
          brand && (query.brand = brand)
          category && (query.category = category)
          createdAt && (query.createdAt = { $gte: createdAt })
         
          //console.log('QUERY CONSTRUIDA: ', query)
          const searchResult = await ProductModel.find(query)
          //console.log('Search result: ',searchResult)
            
         const productsDTOList = searchResult.map(item => ( this.getProductDTO(item)))

         return productsDTOList            
       }catch(error){
            throw error
       }
    }


    async search({limit,page,orderBy,orderField,productId,owner,status,code,brand,category,createdAt}){
        /*
          paginateOptions
          Hace una busqueda y devuelve utilizando paginacion.
          Recibe un objeto con {limit,pageNumber, pageQuantity,orderBy,orderField,query}
          limit: Cantidad de registros totales pedidos. Si no se especifica entonces seran solo 10.
          pageNumber: Numero de pagina solicitada en la busqueda, si no se especifica sera la numero 1.
          orderBy: 1 para Ascendente, 2 para descendente. Si no se especifica se ordena de manera descendente.
          orderField: Campo por el cual se pide el ordenamiento. Pueden ser 'price' o 'stock' o 'createdAt'. Si 
                    no se especifica se usara price.
          
          query: Objeto para la consulta. Funcion igual que get.

          OBJETIVO DEL METODO DEVOLVER UN OBJETO ASI:
          {
               totalProducts: 630,
               matches: seria el length de docs. O sea las coincidencias de busqueda.
               productsList: Lista de dto obtenidos seria los docs transformados en caso de mongo.
               limit: 40,
               totalPages: 16,
               page: 1,
               pagingCounter: 1,
               hasPrevPage: false,
               HasNextPage: true,
               prevPage: null,
               nextPage: 2 
          }
        
        */
        try{
            //Aca iria una validacion de limit,page que sean numeros, orderField que sea -1/1 y orderField un campo permitido.
            const query = {}
            const paginateOptions = {}

            
            paginateOptions.limit = limit || 10
            paginateOptions.page = page  || 1
            if (orderField) paginateOptions.sort = { orderField : orderBy || -1 } //Si no hay ordeber by el orden sera por defecto descendente.
            paginateOptions.sort = { price : orderBy || -1 } //Si no hay ordeber by el orden sera por defecto descendente.
            
            //Voy construyendo el objeto de consulta de acuerdo a si estan o no los parametros.
            productId && (query._id = productId)
            owner && (query.owner = owner)
            status !== undefined && (query.status = status) // Como puede ser true o false hay que probar que no sea undefined o null
            code && (query.code = code)
            brand && (query.brand = brand)
            category && (query.category = category)
            createdAt && (query.createdAt = { $gte: createdAt })
            
            //Procedemos a la busqueda y paginacion.
            let searchResult = await ProductModel.paginate(query,paginateOptions)

            /*
            console.log('Search result: ',searchResult)
            console.log('Search result length docs: ',searchResult.docs.length)
            console.log('QUERY CONSTRUIDA: ', query)
            console.log('OPTIONS SEARCH CONSTRUIDA: ', paginateOptions)
              */
            //Saliendo todo OK esto deberia construir el objeto propuesto.
            return {
                productsQueryList: searchResult.docs.map(item => ( this.getProductDTO(item))),
                totalProducts: searchResult.totalDocs,
                limit: limit,
                totalPages: searchResult.totalPages,
                page: searchResult.page,
                pagingCounter: searchResult.pagingCounter,
                hasPrevPage: searchResult.hasPrevPage,
                hasNextPage: searchResult.hasNextPage,
                prevPage: searchResult.prevPage,
                nextPage: searchResult.nextPage 
            }
        }catch(error){
            throw error
        }
    }



    async getDistinct(selectedField){
        //Este metodo tendra cada dao para devolver una lista con los distintos valores del campo pasado por parametro
        try{
            const distinctValuesList = await ProductModel.distinct(selectedField)
            return distinctValuesList
        }catch(error){
            throw error
        }
    }

    async getCodesListoForOwner(selectedOwner){
        //Devuelve una lista con todos los codigos de productos para un owner determinados
        //De este modo el repositorio y/o capa de servicio saben que no podran ocupar los codigos de esa lista
        try{
            const codesListProductsOwner = await ProductModel.distinct('code',{ owner: selectedOwner })
            return codesListProductsOwner
        }catch(error){

        }
    }

    async updateProductsListById(productsForUpdate){
        /* Tomamos una lista de productos para updatear y devolvemos los DTO actualizados....*/
        /* La idea es aceptar grupos de productos a actualizar...*/
        try{
           /*Mapeo la lista productsForUpdate para saber que campos se quieren actualizar */
           /*{productId:669006295797512a8efc7a41, updateInfo:{newTitle:valor,newDescription} }*/
           /* si no se pasa una propiedasd eje newTitle, no se actualizq xq para mongoose es ndefined
            asique simplemente la idea es pasar newPropiedad por cada propiedad a actualizar.
           */
            const operationsList = productsForUpdate.map( item => (
                ProductModel.findOneAndUpdate(
                    {_id:item.productId},
                    { $set:
                        {
                            owner: item.updateInfo.newOwner,
                            brand:item.updateInfo.newBrand,
                            title:item.updateInfo.newTitle,
                            description: item.updateInfo.newDescription,
                            price: item.updateInfo.newPrice,
                            img: item.updateInfo.newImg,
                            code: item.updateInfo.newCode,
                            category: item.updateInfo.newCategory,
                            stock: item.updateInfo.newStock,
                            status:  item.updateInfo.newStatus,
                            thumbnails: item.updateInfo.newThumbnails,
                            updatedAt: Date.now()

                        }},
                    { new: true } //Para que me devuelva el registro actualizado.
                    )
            ))

            //Resuelvo la lista de promesas y espero a que termine, o sea hago todas las actualizaciones.
            //Los resultados de cada promesa, o sea actualizacion quedan en cada posicion de updateResult
            const updateResults = await Promise.all(operationsList)
            const updatedProductsDTOList = updateResults.map(item => (this.getProductDTO(item)))
            //console.log('Operations: ', updatedProductsDTOList)
            return updatedProductsDTOList
        }catch(error){
            console.log(error)
        }
    }


    async deleteByQuery({productId,owner,status,code,brand,category,createdAt}){
        //Funciona igual que get pero devuelve el array de los DTO borrados Pero borra una lista de productos.
        //Se debe ingresar una lista de [{productId,owner,status,code,brand,category}] para construir la query.
        try{

        const query = {}
          //Voy construyendo el objeto de consulta de acuerdo a si estan o no los parametros.
        productId && (query._id = productId)
        owner && (query.owner = owner)
        status !== undefined && (query.status = status) // Como puede ser true o false hay que probar que no sea undefined o null
        code && (query.code = code)
        brand && (query.brand = brand)
        category && (query.category = category)
        createdAt && (query.createdAt = { $gte: createdAt })
        //Con la query construida hago una busqueda de los productos a eliminar y que voy a devolver.
        const productsForDelete = await ProductModel.find(query)
        //uso la misma lista para tomar los id de los productos a borrar y preparar la lista de promesas
        const deleteResults = await ProductModel.deleteMany(query)
        const productsDTOList = productsForDelete.map(item => (this.getProductDTO(item)))
        //-------------------------------------------
        console.log('resultado elimiancion', deleteResults)
        console.log('resultado lista dto', productsDTOList)
        return productsDTOList 
        }catch(error){

        }
    }



}