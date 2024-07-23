
import {ProductsService} from '../services/products.service.js'
import { mySocketServer } from "../app.js";
import { IncompleteFieldsError, InternalServerError, InputValidationServiceError, ProductsServiceError } from "../services/errors.service.js"
import { getMissingFields } from "../utils/helpers.js";
import { InputValidationService } from "../services/validation.service.js";



const productsService = new ProductsService()
export class ProductsController{


async searchProducts(req,res,next){
    //Recibo por query la paginacion y por body la consulta.
    const {limit,page,order_by,order_field} = req.query
    const {productId,owner,status,code,brand,category,created_before,
          created_after,price_min,price_max,purchases_count_min,purchases_count_max} = req.body
    try{
      //Pasamos por la etapa de validacion.

      //console.log('Entro a controller', req.body,req.query)
      const searchResultObject = await productsService.findProducts({
        limit: limit,
        page: page,
        orderBy: order_by,
        orderField:order_field,
        productId:productId,
        owner:owner,
        status:status,
        code:code,
        brand:brand,
        category:category,
        createdBefore: created_before,
        createdAfter: created_after,
        priceMin: price_min,
        priceMax: price_max,
        purchasesCountMin: purchases_count_min,
        purchasesCountMax: purchases_count_max
      })

      //Si todo salio Ok se envia la respuesta, si no sera cacheado.
      res.status(200).json({
        status: "success", 
        message: `Resultados de busqueda: ${searchResultObject.productsQueryList.length} productos obtenidos.`,
        searchResults:searchResultObject
        })   

      
      
    }catch(error){
        if (error instanceof ProductsServiceError || error instanceof InputValidationServiceError) next(error)
        else next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||ProductsController.findProducts||...'))
    }
}

async getProduct(req,res,next){
    const {pid:productId} = req.params
    try{
        //En este caso podemos hacer la misma busqueda que en searchProducts pero solo filramos por productId
        const searchResultObject = await productsService.findProducts({productId:productId})
        //Si el producto esta totalProducts sera 1, y si no, sera 0. Si es 0 devolvemos error de producto no existe.
        if (searchResultObject.totalProducts == 1){
            res.status(200).json({
                status: "success", 
                message: `Se encontro el producto productId:${productId}...`,
                searchResults:searchResultObject.productsQueryList[0]
                })   
        }
        else{
            console.log('Entro a l ese')
            //lanzo una excepcion del tipo ProductsServiceError para catchear y enviar al middleware de errores.
            throw new ProductsServiceError(ProductsServiceError.PRODUCT_NO_EXIST,'ProductsController.getProduct',`No se encontro el producto productId:${productId}...`)
        }
    }catch(error){
        if (error instanceof ProductsServiceError || error instanceof InputValidationServiceError) next(error)
        else next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||ProductsController.getProduct||...'))
    }
}

async createProduct(req,res,next){
     //Recordar que email hay que sacarlo de los parametros y tomarlo del req del token
     const {email,brand,title,description,price,img,code,category,stock,status,thumbnails} = req.body
    try{
       // console.log('Capa Controller', req.body)
      //paso por la capa de validacion.

      //Si todo salio Ok procedo a crear
      const createdProduct = await productsService.createProduct({
        email:email,
        brand: brand,
        title:title,
        description: description,
        price:price,
        img:img,
        code:code,
        category:category,
        stock:stock,
        status:status,
        thumbnails:thumbnails
      })

      //Si todo salio OK revuelvo el producto en la respuesta, si no ira a excpecion
      res.status(200).json({
        status: "success", 
        message: `Se creo el nuevo producto con productId:${createdProduct.productId}...`,
        searchResults:createdProduct
        })      

    }catch(error){
        if (error instanceof ProductsServiceError || error instanceof InputValidationServiceError) next(error)
            else next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||ProductsController.createProduct||...'))
    }
}




async addProductsList(req,res,next){
    //Recordar que email hay que sacarlo de los parametros y tomarlo del req del token
    try{
        const {email,productsList} = req.body
        //Pasa por la capa de validacion primero

        //Si pasa la validacion.
        const createdProductsObject = await productsService.createProductsGroup(email,productsList)
        
          //Si todo salio OK revuelvo el producto en la respuesta, si no ira a excpecion
        res.status(200).json({
        status: "success", 
        message: `Resultado de la creacion de lista de productos.`,
        searchResults:createdProductsObject
        })      

        
    }
    catch(error){
        if (error instanceof ProductsServiceError || error instanceof InputValidationServiceError) next(error)
        else next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||ProductsController.addProductsList||...'))
    }
    }


async editProduct(req,res,next){
    const {pid:productId} = req.params
    const {brand,title,description,price,img,code,category,stock,status,thumbnails} = req.body
  // console.log('cvontroller', req.params,req.body)
    try{
      //Pasamos por la capa de validacion.

      //Si todo salio OK mandamos a la capa de servicios.
      const updatedProduct = await productsService.editProduct({productId,brand,title,description,price,img,code,category,stock,status,thumbnails})
           //Si todo salio OK revuelvo el producto en la respuesta, si no ira a excpecion
        res.status(200).json({
        status: "success", 
        message: `Resultado de la edicion del producto productID ${productId}.`,
        searchResults:updatedProduct
        })      
    
    
    }catch(error){
        console.log(error)
        if (error instanceof ProductsServiceError || error instanceof InputValidationServiceError) next(error)
            else next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||ProductsController.editProducts||...'))
    }
}

async deleteProduct(req,res,next){
    const {pid:productId} = req.params
    try{
    //Pasamos x la capa de validacion.

    //Si todo va bien procedemos a borrar.
    const deletedProduct = await productsService.deleteProduct(
        {
        userEmail:req.currentUser.email,
        productId:productId
        
    })
    res.status(200).json({
        status: "success", 
        message: `Se borro el producto productId:${productId}...`,
        product:deletedProduct
        })   
    }catch(error){
        if (error instanceof ProductsServiceError || error instanceof InputValidationServiceError) next(error)
        else next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||ProductsController.deleteProduct||...'))
    }
}



async addProductFromRealTimeProductsView(req,res,next){
    const {title,description,code,price,stock,category,status,img} = req.body

    try{
       const addProductResult = await productRepository.addProduct({
            title:title,
            description:description,
            price:price,
            img:img,
            code:code,
            category:category,
            stock:stock,
            status:status,
            thumbnails:'tt'})

    console.log(addProductResult)
    //Si todo salio OK hacemos el socket.emit, de lo contrario errorpage y mensaje.
    if (addProductResult.success){
        //console.log('socketEMit')
        mySocketServer.emitAddProduct()
        res.status(204).end();
    }
    else{
        res.render('messagepage',{message: addProductResult.message})
    }

    }catch(error){
          //Aca podria llegar a venir un error del productsSerVICE a futuro cuando sea implementado.
     next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.addProductFromRealTimView||...'))
    }
 
}


}