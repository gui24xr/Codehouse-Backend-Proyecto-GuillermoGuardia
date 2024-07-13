
import { ProductDTO } from "../../dto/products.dto.js"
import { ProductModel } from "../../models/product.model.js"
import { ProductsServiceError, ProductDTOERROR } from "../../services/errors.service.js"


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
            purchasesCount: productFromDB.purchasesCount,
            createdAt:productFromDB.createdAt,
            thumbnails:productFromDB.thumbnails,
        })
    }

    
    makeQueryFromObject({productId,owner,status,code,brand,category,createdAtRange,priceRange,purchasesCountRange}){
        //Devuelve la consulta construida para formato mongoose.
        try{
            const query = {}
            //Voy construyendo el objeto de consulta de acuerdo a si estan o no los parametros.
            productId && (query._id = productId)
            owner && (query.owner = owner)
            status !== undefined && (query.status = status) // Como puede ser true o false hay que probar que no sea undefined o null
            code && (query.code = code)
            brand && (query.brand = brand)
            category && (query.category = category)
         
            if (priceRange){
                if (!priceRange.max)  query.price = { $gte: priceRange.min }
                //Si no vino el minimo busco entre cero y max.
                if (!priceRange.min) query.price  = { $gte: 0 , $lte: priceRange.max }
                //Y si vienen ambos y obvio son mayor que cero entonces pido el rango.
                if (priceRange.min >= 0 && priceRange.max >= 0) query.price = { $gte: priceRange.min , $lte: priceRange.max }
            }
            
            if (purchasesCountRange){
                if (!purchasesCountRange.max)  query.price = { $gte: purchasesCountRange.min }
                //Si no vino el minimo busco entre cero y max.
                if (!purchasesCountRange.min) query.price  = { $gte: 0 , $lte: purchasesCountRange.max }
                //Y si vienen ambos y obvio son mayor que cero entonces pido el rango.
                if (purchasesCountRange.min >= 0 && purchasesCountRange.max >= 0) query.price = { $gte: purchasesCountRange.min , $lte: purchasesCountRange.max }
            }
    
            if (createdAtRange){
                //Supongamos qiue min ymax vendran como 'aaaa-mm-dd' y en string
                //Si no vino el maximo es un 'a partir de tal fecha! entonces uso una fecha del pasado'
                if (!createdAtRange.max)  query.price = { $gte:  new Date(createdAtRange.min) }
                //Si no vino el minimo busco entre cero y max.
                if (!createdAtRange.min) query.price  = { $gte:  new Date('1900-01-01') , $lte: new Date(createdAtRange.max) }
                //Y si vienen ambos y obvio son mayor que cero entonces pido el rango.
                if (createdAtRange.min >= 0 && createdAtRange.max >= 0) query.price = { $gte: new Date(createdAtRange.min) , $lte: new Date(createdAtRange.max) }
            }
    
            return query
        }catch(error){
            if (error instanceof ProductsServiceError) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.makeQueryFromObject|','Error interno del servidor...')
        }
      
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
            //console.log('Entrada: ',productsList)
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
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.createProducts|','Error interno del servidor...')
        }
    }

    
    async get({productId,owner,status,code,brand,category,createdAtRange,priceRange,purchasesCountRange}){
       //Devuelve un array con productDTO que coincida la busqueda.
       //Se puede combinar los parametros para hacer el get.
       //Si no se pasa ninguna propiedad, o sea {} devuelve todos los productos.
       //Todas las propiedades se comparan por igualdad excepto createdAT que se devuelve los anterior igual a la fecha ingresada.
       //PurchaseCountRabge debe ser un objeto {min:valor,max:valor}
       //Si en el objetoi no se incluye max hay que dar error. Se puede obviar el minimo, si, no, sera cero pero no el maximo
       try{
          const query = this.makeQueryFromObject({productId,owner,status,code,brand,category,createdAtRange,priceRange,purchasesCountRange})
          const searchResult = await ProductModel.find(query)
          const productsDTOList = searchResult.map(item => ( this.getProductDTO(item)))
          return productsDTOList            
       }catch(error){
        if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
        else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.get|','Error interno del servidor...')
       }
    }


    makePaginationValuesObject({limit,page,orderBy,orderField}){
        //Construye el objeto de paginacion para moongosepagination
        try{
            const paginateOptions = {}
            //Construccion de la paginacion
            paginateOptions.limit = limit || 10
            paginateOptions.page = page  || 1
            if (orderField) {
                //Si me pasaron campo de ordenacion lo ordenanos por ese cammpo,
                paginateOptions.sort = { orderField : orderBy || -1 }
            } //Si no hay ordeber by el orden sera por defecto descendente.
            else {
            //Si no se paso campo de ordenacio ordenamos por createdAt Descendente
             paginateOptions.sort = { createdAt : orderBy || -1 }
            }
            paginateOptions.sort = { price : orderBy || -1 } //Si no hay ordeber by el orden sera por defecto descendente.

            return paginateOptions
        }catch(error){
            if (error instanceof ProductsServiceError) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.makePaginationValuesObject|','Error interno del servidor...')
        }
    }

    async search({limit,page,orderBy,orderField,productId,owner,status,code,brand,category,createdAtRange,priceRange,purchasesCountRange}){
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
            const query = this.makeQueryFromObject({productId,owner,status,code,brand,category,createdAtRange,priceRange,purchasesCountRange})
            const paginateOptions = this.makePaginationValuesObject({limit,page,orderBy,orderField})
            //Procedemos a la busqueda y paginacion.
            let searchResult = await ProductModel.paginate(query,paginateOptions)
            //Saliendo todo OK esto deberia construir el objeto propuesto.
            return {
                productsQueryList: searchResult.docs.map(item => ( this.getProductDTO(item))),
                totalProducts: searchResult.totalDocs,
                limit: searchResult.limit,
                totalPages: searchResult.totalPages,
                page: searchResult.page,
                pagingCounter: searchResult.pagingCounter,
                hasPrevPage: searchResult.hasPrevPage,
                hasNextPage: searchResult.hasNextPage,
                prevPage: searchResult.prevPage,
                nextPage: searchResult.nextPage 
            }
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.search|','Error interno del servidor...')
        }
    }



    async getDistinct(selectedField){
        //Este metodo tendra cada dao para devolver una lista con los distintos valores del campo pasado por parametro
        try{
            const distinctValuesList = await ProductModel.distinct(selectedField)
            return distinctValuesList
        }catch(error){
            if (error instanceof ProductsServiceError) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.getDistinct|','Error interno del servidor...')
        }
    }

    async getCodesListForOwner(selectedOwner){
        //Devuelve una lista con todos los codigos de productos para un owner determinados
        //De este modo el repositorio y/o capa de servicio saben que no podran ocupar los codigos de esa lista
        try{
            //Valido que exista el owner, de lo contrario error.
            const ownerList = await this.getDistinct('owner')
            if (!ownerList.includes(item=>item == selectedOwner)) console.log('No existe owner ')
            const codesListProductsOwner = await ProductModel.distinct('code',{ owner: selectedOwner })
            return codesListProductsOwner
        }catch(error){
            if (error instanceof ProductsServiceError) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.getCodesListForOwner|','Error interno del servidor...')
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
                            purchasesCount: item.updateInfo.newPurchasesCount,
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
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.updateProductsListById|','Error interno del servidor...')
        }
    }


    async deleteByQuery({productId,owner,status,code,brand,category,createdAtRange,priceRange,purchasesCountRange}){
        //Funciona igual que get pero devuelve el array de los DTO borrados Pero borra una lista de productos.
        //Se debe ingresar una lista de [{productId,owner,status,code,brand,category}] para construir la query.
        try{

        const query = this.makeQueryFromObject({productId,owner,status,code,brand,category,createdAtRange,priceRange,purchasesCountRange})
        //Con la query construida hago una busqueda de los productos a eliminar y que voy a devolver.
        const productsForDelete = await ProductModel.find(query)
        //uso la misma lista para tomar los id de los productos a borrar y preparar la lista de promesas
        await ProductModel.deleteMany(query)
        /*const deleteOperations = productsForDelete.map(item => (ProductModel.findOneAndDelete({_id: item._id})))
        const deleteResults = await Promise.all(deleteOperations)

        //console.log('resultado elimiancion', deleteResults)
        */
        const deletedProductsDTOList = productsForDelete.map(item => this.getProductDTO(item))
        return  deletedProductsDTOList
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.deleteByQuere|','Error interno del servidor...')
        }
    }



    async deleteByList(productsForDelete){
        //Recibe una listo con los ID de los productos a borrar y borra uno a uno, luego devuelve su dto.
        try{
        //Validar la lsita o dar error
        const deleteOperations = productsForDelete.map(item => (ProductModel.findOneAndDelete({_id: item})))
        const deleteResults = await Promise.all(deleteOperations)

        //console.log('resultado elimiancion', deleteResults)
        const deletedProductsDTOList = deleteResults.map(item => this.getProductDTO(item))
        return  deletedProductsDTOList
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|MongoProductsDAO.deleteByList|','Error interno del servidor...')
        }
    }


}