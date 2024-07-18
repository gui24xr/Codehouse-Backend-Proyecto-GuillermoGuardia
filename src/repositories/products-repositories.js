import { ProductsDAO } from "../dao/factory.js";
import { ProductsServiceError, ProductDTOERROR } from "../services/errors.service.js";
import { InputValidationService } from "../services/validation.service.js";

const productsDAO = new ProductsDAO()

export class ProductsRepository{
   

    async findProducts({limit,page,orderBy,orderField,productId,owner,status,code,brand,category,createdBefore,createdAfter,priceMin,priceMax,purchasesCountMin,purchasesCountMax}){
          //Arma la consulta de busqueda de productos segun reglas DAO.
        try{
            //console.log('Entro a repo: ',{limit,page,orderBy,orderField,productId,owner,status,code,brand,category,createdBefore,createdAfter,priceMin,priceMax,purchasesCountMin,purchasesCountMax})
            const searchResultObject = await productsDAO.search({
                limit:limit,
                page:page,
                orderBy: orderBy,
                orderField: orderField,
                productId: productId,
                owner: owner,
                status: status,
                code:code,
                brand: brand,
                category: category,
                createdAtRange:{
                    min: createdAfter,
                    max: createdBefore
                },
                priceRange:{
                    min:priceMin,
                    max:priceMax
                },
                purchasesCountRange:{
                    min: purchasesCountMin,
                    max: purchasesCountMax
                }
                    
            })
            //Obtenemos el objeto del resultado de search y lo devolvemos
            return searchResultObject

        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.findProducts|','Error interno del servidor...')
        }
    }





    async deleteProductsList(productsList){
        //Recibe una lista de productsID y le pide  ala BD que los borre
        //Devuelve los DTO borrados o lanza excepcion si no se borro nada xq se encontro.
        try{
            if (!Array.isArray(productsList)) throw new ProductsServiceError(ProductsServiceError.DELETING_ERROR,'ProductsRepository.deleteProductsList','No se ingreso una lista de productos valida....')
            const deletedProductsList = await productsDAO.deleteByList(productsList)
            //SI borro algo, viene el array con lo borrado, y si no borro nada lanza error ya que ningun producto existia.
            if (deletedProductsList.length>0) return deletedProductsList
            else throw new ProductsServiceError(ProductsServiceError.DELETING_ERROR,'ProductsRepository.deleteProductsList','No se encontraron productos para borrar...')
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.deleteProductsList|','Error interno del servidor...')
        }
    }


    async createProducts(productsDataList){
        //Crea una lista de productos y devuelve los resultados.
        try{
            if (!Array.isArray(productsDataList)) throw new ProductsServiceError(ProductsServiceError.CREATE_ERROR,'ProductsRepository.createProducts','No se ingreso una lista con datos de productos valida....')
            //Hacemos una validacion para que cada elemento de la lista de productos tenga los campos minimos necesarios.
            if (!productsDataList.every(item => ('title' in item) && ('status' in item) && ('brand' in item) && ('price' in item) && ('code' in item) && ('category' in item) && ('stock' in item))) {
                throw new ProductsServiceError(ProductsServiceError.CREATE_ERROR,'ProductsRepository.createProducts','Faltan uno o mas campos obligatorios en uno o mas productos de la lista...')
              }
              
             //Si todo salio OK proceso a la creacion..
            const createdProductsList = await productsDAO.createProducts(productsDataList)
            //SI borro algo, viene el array con lo borrado, y si no borro nada lanza error ya que ningun producto existia.
            if (createdProductsList.length>0) return createdProductsList
            else [] //Si no creo productos retorna []
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.createdProducts|','Error interno del servidor...')
        }
    }



    async getCodesListByOwner(userEmail){
        try{

            const codesProductsList = await productsDAO.getCodesListForOwner(userEmail)
            return codesProductsList
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.createdProducts|','Error interno del servidor...')
        }
    }


    async editProducts(productsListForUpdate){
        /* {//Recibe lista de objetos
            productId:'grerd'
                code: 'DEF45A6NUE',
                brand: 'nueva marca',
                title: 'nuevo title',
                status: true,
                stock: 10,
                category: 'nuevo category',
                description: 'nueva descripcion',
                img: '/img/products/defaultproduct.png',
                thumbnails: ['/img/products/defaultproduct.png',/img/products/defaultproduct.png'],
            }
              */
        try{
            //Recibe una lista de productsList para hacer update, las mapea para el DAO
             const listForProductsDAO = productsListForUpdate.map(item => (
                {
                    productId: item.productId,
                    updateInfo:{
                        newbrand:item.brand,
                        newTitle:item.title,
                        newDescription: item.description,
                        newPrice: item.price,
                        newImg: item.img,
                        newCode: item.code,
                        newCategory: item.category,
                        newStock: item.stock,
                        newStatus:  item.status,
                        newThumbnails: item.thumbnails,
                    }
                }
            ))
             const updatedProducts = await productsDAO.updateProductsListById(listForProductsDAO)
             return updatedProducts
             
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.editProducts|','Error interno del servidor...')
        }
    }


    async getProductsCategoriesList(){
        //Devuelve todas las diferentes categorias del catalogo de productos.
        try{
            const categoriesList = await productsDAO.getDistinct('category')
            return categoriesList
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.editProducts|','Error interno del servidor...')
        }
    }


    async getProducts(){
        try {
            const products = await productsDAO.get({})
            return products
        } catch (error) {
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsRepository.getProducts|','Error interno del servidor...')
        }
   }


    
   //-----------------------------------------------
    
  



















}