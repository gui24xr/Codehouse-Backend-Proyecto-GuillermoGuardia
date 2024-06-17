import { ProductModel } from "../../models/product.model.js";
import { ProductDTO } from "../../dto/products.dto.js";
import { ProductsServiceError, ProductDTOERROR } from "../../services/errors.service.js";


export class ProductsMongoDAO{
    getProductDTO(productFromDB){
        return productFromDB
    }

    // Función interna para transformar el filtro
    transformFilter(filter) {
    const transformedFilter = { ...filter };
    if (filter.id) {
        transformedFilter._id = filter.id;
        delete transformedFilter.id;
        }
        return transformedFilter;
    }

    //Recibimos una instancia de objeto de creacion de producto
    //Devolvemos DTO con el registro creado.
    async create(productData){
        try{
            const newProduct = new ProductModel({
                title :  productData.title,
                description :  productData.description,
                price :  productData.price,
                img :  productData.img,
                code :  productData.code,
                category :  productData.category,
                owner :  productData.owner,
                stock :  productData.stock,
                status :  productData.status,
                thumbnails : productData.thumbnails
            })
            await newProduct.save()
            return this.getProductDTO(newProduct)
        }catch(error){
            if (error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.CREATE_ERROR,'|ProductsMongoDAO.create|',error.message)
        }
    }



    async get(filter){
        try{
            const transformedFilter = this.transformFilter(filter);
            const productsArray = await ProductModel.find(transformedFilter)
            //Tengo el array con coincidencias, y quiero devolver lista de DTO
            const products = productsArray.map( item => (
                this.getProductDTO(item)
            ))
            return products
        }catch(error){
            if (error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.GET_ERROR,'|ProductsMongoDAO.get|',error.message)
        }
    }


    
    async update(filter,updatedData){
        try{
            const transformedFilter = this.transformFilter(filter);
            await ProductModel.updateMany(transformedFilter,updatedData)
            //Tengo el array con coincidencias, y quiero devolver lista de DTO
            const updatedProductsArray = await ProductModel.find(transformedFilter);
            const products = updatedProductsArray.map( item => (
                this.getProductDTO(item)
            ))
            return products
        }catch(error){
            if (error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.UPDATING_ERROR,'|ProductsMongoDAO.update|',error.message)
        }
    }


    async delete(filter){
        
        //Busca los registros que coinciden con el filtro y los elimina, devuelve una lista de dto con copia de los registros eliminados
        try{
            const transformedFilter = this.transformFilter(filter);
            //falta validar los filtros.
            //Los busco y guardo un array
            const productsToDelete =  await ProductModel.find(transformedFilter) 
            const productsDTOArray = productsToDelete.map( item => (
                this.getProductDTO(item)
            ))
            //Los borro
            await ProductModel.deleteMany(transformedFilter)
            //Devuelvo la lista con las copias de lo borrado si salio todo bien.
            return productsDTOArray
        }catch(error){
            if (error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.DELETING_ERROR,'|ProductsMongoDAO.delete|',error.message)
        }
    }

}



