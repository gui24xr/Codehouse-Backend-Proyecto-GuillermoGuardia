import express from 'express'

import { ProductController } from '../controllers/products-controller.js'

//Creo mi router.
export const router = express.Router()
//Creo la instancia.

const productController = new ProductController()


router.get('/products',productController.getProductsListPaginate)//Deveulve paginado
router.get('/products/:pid',productController.getProductById)//Devuelve listado entero
router.post('/products',productController.addProduct)
router.put('/products/:pid',productController.updateProduct)
router.delete('/products/:pid',productController.deleteProduct)
router.post('/products/addProductFromRealTimeProductsView', productController.addProductFromRealTimeProductsView)
router.get('/products/:id/changestatus',productController.changeProductStatus)

