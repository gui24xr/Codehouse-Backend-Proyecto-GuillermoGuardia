
import { MongoProductsDAO } from "../dao/mongo/products.mongo.dao.js";
import { ProductsServiceError, ProductDTOERROR } from "../services/errors.service.js";

const productsDao = new MongoProductsDAO()

export class ProductsRepository{
   
    async getProducts(){
        try {
            const products = await productsDao.get({})
            return products
        } catch (error) {
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.getProducts|','Error interno del servidor...')
        }
   }



   async getProductById(productId){
         try {
            const searchedProduct = await productsDao.get({productId:productId})
            return searchedProduct[0]
        } catch (error) {
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.getProductById|','Error interno del servidor...')
        }

   }

   async getProductStock(productId){
    try {
        const searchedProduct = await productsDao.get({productId:productId})
        return searchedProduct[0].stock
   } catch (error) {
    if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
    else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.getProductStock|','Error interno del servidor...')
   }

}


   async updateProductStock(productId,newStockQuantity){
     try{
        const updatedProductsList = await productsDao.updateProductsListById([
            { productId:productId, 
              updateInfo:{newStock: newStockQuantity} }
        ])
        //como recibo lista de dto y es solo uno
        return updatedProductsList[0]
     } catch(error){
        if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
        else throw new UsersServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.updateProductStock|','Error interno del servidor...')
     }
   }


   async updateProduct(productId,newProduct){
    try {
        const updatedProduct = await productsDao.updateProduct(productId,newProduct)
        return updatedProduct
    } catch (error) {
        throw new Error('Error al intentar actualizar producto...')
    }
   }

   async deleteProduct(productId){
   try {
        const deletedResult = await productsDao.deleteProduct(productId)
        return deletedResult
        }  catch (error) {
        throw new Error('Error al intentar eliminar producto...')
    }
   }

   async getProductsPaginate(limit,page,sort,query){
    try {
        const products = await productsDao.getProductsPaginate(limit,page,sort,query)
        return products
    } catch (error) {
      console.log('Error al recuperar los productos...')
      throw error
    }
  }

  async getProductsByFilter(filter,pageSize,pageNumber){
    try {
        const result = await productsDao.getProductsByFilter(filter,pageSize,pageNumber)
        return result
    } catch (error) {
      console.log('Error al intentar getproductsFilter desde repository products...')
      throw error
    }
  }



    async addProduct({title, description,price,img,code,category,stock,status,thumbnails}){
        
        //console.log('En repository: ',title, description,price,img,code,category,stock,status,thumbnails)
        try{
           const addResult = await productsDao.addProduct({title, description,price,img,code,category,stock,status,thumbnails})
           return addResult
        }catch(error){
            res.status(500)
        }
    }

    async changeProductStatus(productId){
        try{ 
            const updateStateResult = await productsDao.changeProductStatus(productId)
            return updateStateResult   
        }catch(error){
            throw new Error(`Error al intentar cambiar estado a producto ${productId} desde productRepository...`)
        }
    }

    async getProductsCategoriesList(){
        //Devuelve todas las diferentes categorias del catalogo de productos.
        try{
            const categoriesList = await productsDao.getProductsCategoriesList()
            return categoriesList
        }catch(error){
            throw new Error(`Error al intentar obtener lista de categorias desde productRepository...`)
        }
    }





}