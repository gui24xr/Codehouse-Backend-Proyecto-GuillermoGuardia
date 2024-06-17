import { ProductDTO, ProductoConstructionObject } from "../dto/products.dto.js";
import { ProductDTOERROR, ProductsServiceError } from "../services/errors.service.js";
import { ProductsDAO } from "../dao/factory.js";
import { ProductsMongoDAO } from "../dao/mongo/products.mongo.dao.remake.js";

const productsDAO = new ProductsMongoDAO//ProductsDAO()
export class ProductsRepository{

    //Devuelve true o false si existe producto con dicho codigo.
    async existProductByCode(code){
        try{
            const productsList = await productsDAO.get({code:code})
            if (productsList.length > 0) return true
            else return false
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductsServiceError) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.existProductByCode|',error.message)
        }
    }

    async getProductById(productId){
        try{
            const productsList = await productsDAO.get({id:productId})
            if (productsList.length > 0) return productsList[0]
            else throw new ProductsServiceError(ProductsServiceError.PRODUCT_NO_EXIST)
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductsServiceError) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.getProductById|',error.message)
        }
    }

    async getProductByCode(code){
        try{
            const productsList = await productsDAO.get({code:code})
            if (productsList.length > 0) return productsList[0]
            else throw new ProductsServiceError(ProductsServiceError.PRODUCT_NO_EXIST)
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductsServiceError) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.getProductByCode|',error.message)
        }
    }

    //Cambia el status del producto y lo devuelve.
    async changeProductStatus(productId){
        try{
            //Obtengo el producto para saber su estado.
            const product = await this.getProductById(productId)
            console.log(product)
            const newValue = product.status ? false : true //Cambia a true o false segun como este actualmente
            const updatedProductList = await productsDAO.update({id:productId},{'status':newValue})
            return updatedProductList[0]
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductsServiceError) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.changeProductStatus|',error.message)
        }
    }

    //
    async updateStock(productId,newStock){
        console.log(productId,newStock)
        try{
            const updatedProductList = await productsDAO.update({id:productId},{'stock':newStock})
            return updatedProductList[0]
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductsServiceError) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.updateStock|',error.message)
        }
    }

    async createProduct(productId){
        try{

        }catch(error){
            
        }
    }

    async deleteProduct(productId){
        try{
            //Como es por Id obligatoriamente devuelve 1, y si no es 1,es error igual que en get
            const deletedProductsList = await productsDAO.delete({id:productId}) 
            if ( deletedProductsList.length > 0) return deletedProductsList[0]
            else throw new ProductsServiceError(ProductsServiceError.PRODUCT_NO_EXIST)
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductsServiceError) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.deleteProduct|',error.message)
        }
    }




}