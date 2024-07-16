import { ProductsRepository } from "../repositories/products-repositories.js";
import {ProductsService} from '../services/products.service.js'
import { mySocketServer } from "../app.js";
import { IncompleteFieldsError, InternalServerError, InputValidationServiceError, ProductsServiceError } from "../services/errors.service.js"
import { getMissingFields } from "../utils/helpers.js";
import { InputValidationService } from "../services/validation.service.js";
import { consoleFormat } from "../utils/loggers/logger.configs.js";


const productRepository = new ProductsRepository()
const productsService = new ProductsService()
export class ProductsController{
/*
    //Devuelve todos los productos
    async getProducts(req,res,next){
        const {limit} = req.query
        try{
            const productsList = await productRepository.getProducts()  
            if (limit){
                res.status(200).json({
                    status: "success", 
                    message: `Productos obtenidos satisfactoriamente Limit: ${limit}!!`,
                    products: productsList.slice(0,limit)
                    })
                }
            else{
                res.status(200).json({
                    status: "success", 
                    message: `Productos obtenidos satisfactoriamente.`,
                    products: productsList
                    })
            }
        }catch(error){
            //Aca podria llegar a venir un error del productsSerVICE a futuro cuando sea implementado.
            next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.getProducts||...'))
        }
    }

   

    //Devuelve los productos paginados pero devuelve solo los que tienen status true.
async getProductsListPaginate(req,res,next){
    const {limit,page,sort,query} = req.query     
    try{
         const sortValue = sort == '1' ? 1 : sort == '-1' ? -1 : 0   //console.log('SortValue', sortValue)
        const paginate = await productRepository.getProductsPaginate(limit ? limit : 10,page ? page : page,sortValue,query)
        res.status(200).json({
            status: "success", 
            message: `Productos obtenidos satisfactoriamente.`,
            products: paginate
            })

    }catch(error){
         //Aca podria llegar a venir un error del productsSerVICE a futuro cuando sea implementado.
         next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.getProductsListPaginate||...'))
    }
}

    async getProductById(req,res,next){
        const {pid:productId} = req.params
        try{
            const searchedProduct = await productRepository.getProductById(productId)
            //console.log(searchedProduct)
            !searchedProduct
            ? res.send('Producto no encontrado!')
            : res.json(searchedProduct)
           
        }catch(error){
              //Aca podria llegar a venir un error del productsSerVICE a futuro cuando sea implementado.
         next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.getProductById||...'))
        }
    }


    async deleteProduct(req, res,next){
        const {pid:productIdToDelete} = req.params
           try{
             const deleteResult = await productRepository.deleteProduct(productIdToDelete)
            console.log('uu: ', deleteResult)
            !deleteResult.isSuccess 
            ? res.send('No existe el producto con este id...')
            : res.json(deleteResult)
      
        } catch(error){
              //Aca podria llegar a venir un error del productsSerVICE a futuro cuando sea implementado.
         next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.deleteProduct||...'))
        }
    }

    async updateProduct(req,res,next){
        const {pid:productIdToUpdate} = req.params
        const itemsToUpdateObject = req.body  //console.log(req.params,req.body)
        try{
            const updateResult = await productRepository.updateProduct(productIdToUpdate,itemsToUpdateObject)
            !updateResult.isSuccess 
            ? res.send('No existe el producto con este id...')
            : res.json(updateResult)
            
        }catch(error){
            //Aca podria llegar a venir un error del productsSerVICE a futuro cuando sea implementado.
            next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.updateProduct||...'))
        }
    }

    async addProduct2(req,res,next){
        const {title,description,price,img,category,stock,thumbnails} = req.body
        try{
            //Pasamos por la capa de validacion.
            InputValidationService.checkProductItem(req.body,'Add')

            res.send('ok')
        }catch(error){
            if (error instanceof IncompleteFieldsError || error instanceof InputValidationServiceError)
                    next(error)
            
              else{
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.getProductById||...'))
              }
         
        }
    }


    async addProduct(req,res,next){
        const productToAdd = req.body
        const requiredFields = ['title', 'description', 'price', 'img', 'code', 'category', 'stock', 'status']
        const missingFields = getMissingFields(req.body,requiredFields)
        
        try{
            //Si no se ingresan todos los campos entonces se va al middleware de error.
            if (missingFields.length > 0)  throw new IncompleteFieldsError(`Faltan ingresar los siguientes campos: ${missingFields}`)
        
            //SI Estan todos los campos entonces se procede...
            const addResult = await productRepository.addProduct(productToAdd)
            !addResult.success 
            ? res.status(201).json(addResult)
            : res.status(201).json(addResult)

        }catch(error){
            if (error instanceof IncompleteFieldsError){
    
                next(error)
            } 
              else{
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.getProductById||...'))
              }
         
            
        }
    }

    async addProductFromRealTimeProductsView(req,res,next){
        //const productToAdd = req.body
        console.log('prrr: ', req.body)
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

async changeProductStatus(req,res,next){
    //Se encarga de cambiar de activo/inactivo el estado del producto para que aparezca o no en la tienda.
    const {id:productId} = req.params
    console.log(`Cambiar estado a productID ${productId}`)
    try{
        const changeStatusResult = await productRepository.changeProductStatus(productId)
        if(changeStatusResult.success){
            //console.log('socketEMit')
            mySocketServer.emitAddProduct()
            res.status(204).end();
        }
        else{
            res.render('messagepage',{message: changeStatusResult.message})
        }
        
    }catch(error){
          //Aca podria llegar a venir un error del productsSerVICE a futuro cuando sea implementado.
          next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||productsController.getProductStatus||...'))

    }
}
*/

//---------------------------------------------------------------------
//NUEVOS CONTROLLERS ---------------------------------------------

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
        console.log('Capa Controller', req.body)
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
    const deletedProduct = await productsService.deleteProduct(productId)
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



}