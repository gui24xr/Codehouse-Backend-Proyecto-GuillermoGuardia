import { ProductsRepository } from "../repositories/products-repository.js";
import { ProductDTO, ProductConstructionObject } from "../dto/products.dto.js";
import { ProductsServiceError, ProductDTOERROR } from "./errors.service.js";
import { getMissingFields } from "../utils/helpers.js";

const productsRepository = new ProductsRepository()

export class ProductsService{

    async getProducts(){
        try {
            const products = await productsRepository.getProducts()
            return products
        } catch (error) {
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.getProducts|',error.message)
        }
   }


   async addProduct(productDataObject){
    //Recibe un objeto Valida que esten todos los campos requeridos.
    //la validacion se hace en el objeto de construccion

    try{
        //Recibe un producto. Si no existe un producto con el code ingresado entonces lo agrega, si no, devuelve un error de productExist.
        //Respecto al owner le pregunta al servicio de usuarios el rol del user para saber si le puedo agregar o no.
        //Creamos el objeto de construccion de producto para enviar al repository que hablara con la BD.
        
        //primero se asegura que no exista un producto con el code....
        const existProduct = await productsRepository.existProductByCode(productDataObject.code)
        if (existProduct) throw new ProductsServiceError(ProductsServiceError.PRODUCT_WITH_SAME_CODE_ALREADY_EXIST,'|ProductsService.addProduct|')
        const productData = new ProductConstructionObject(productDataObject)
        const newProduct = await productsRepository.createProduct(productData)
        return newProduct
    
    }catch(error){
        if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
        else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.addProduct|',error.message)
    }
   }

   async getProductById(productId){
    try {
       const searchedProduct = await productsRepository.getProductById(productId)
       return searchedProduct
   } catch (error) {
    if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
    else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.addProduct|',error.message)
   }

}

    //ESTA FUNCION A FUTURO SERA BORRADA, YA QUE SE DEVUELVE DTO USO LAS PROPIEDADES Y LISTO
    async getProductStock(productId){
    try { //como me devuelven dto
        const searchedProduct = await productsRepository.getProductById(productId)
        return searchedProduct.stock
    } catch (error) {
        if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
        else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.addProduct|',error.message)
    }

    }


   async getProductsCategoriesList(){
    //Devuelve todas las diferentes categorias del catalogo de productos.
    try{
        const categoriesList = await productsRepository.getCategoriesList()
        return categoriesList
    }catch(error){
        if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
        else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.getProductsCategoriesList|',error.message)
    }
}

async changeProductStatusById(productId){
    try{ 
        const updateStateResult = await productsRepository.changeProductStatus(productId)
        return updateStateResult   
    }catch(error){
        if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
        else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.changeProductStatusById|',error.message)
    }
}

async deleteProductById(productId){
    try {
        //Borra el producto por ID
         const deletedResult = await productsRepository.deleteProduct(productId)
         return deletedResult
         }  catch (error) {
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.deleteProductById|',error.message)
     }
    }

    async updateProductStockById(productId,newStockQuantity){
        //Actualiza el stock del producto y si el stock queda en cero lo pone en status false
        //Si es mayor a cero no necesariamente status es true xq puedo un vendedor pausar ese estado.
        try{
           await productsRepository.updateStock(productId,newStockQuantity)
           if (newStockQuantity < 1) await productsRepository.changeProductStatus(productId)
            //Ahora lo pido al repository para devolverlo actualizado
           const updatedProduct = await productsRepository.getProductById(productId)
           return updatedProduct
        } catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.updateProductStockById|',error.message)
        }
      }
   


      //---** reimplementar -----------------------------
      async updateProduct(productId,newProduct){
        try {
            const updatedProduct = await mongoProductsDAO.updateProduct(productId,newProduct)
            return updatedProduct
        } catch (error) {
            throw new Error('Error al intentar actualizar producto...')
        }
       }

       async getProductsByFilter(filter,pageSize,pageNumber){
        try {
            const result = await mongoProductsDAO.getProductsByFilter(filter,pageSize,pageNumber)
            return result
        } catch (error) {
          console.log('Error al intentar getproductsFilter desde repository products...')
          throw error
        }
      }

      
   async getProductsPaginate(limit,page,sort,query){
    try {
        const products = await mongoProductsDAO.getProductsPaginate(limit,page,sort,query)
        return products
    } catch (error) {
      console.log('Error al recuperar los productos...')
      throw error
    }
  }
    



   

}
