import { ProductsRepository } from "../repositories/products.repositories.js";
import { mySocketServer } from "../app.js";
import { IncompleteFieldsError, InternalServerError, InputValidationServiceError } from "../services/errors.service.js"
import { getMissingFields } from "../utils/helpers.js";
import { InputValidationService } from "../services/validation.service.js";


const productRepository = new ProductsRepository()

export class ProductController{

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
           // InputValidationService.checkProductItem(req.body,'Add')

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


}