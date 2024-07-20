import express from 'express'
import { onlyAuthUsers, allowAccessRolesMiddleware,blockRoleAccessMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { ProductsController } from '../controllers/products.controller.js'

//Creo mi router.
export const router = express.Router()

const productsController = new ProductsController()

router.get('/products',productsController.searchProducts)//Devuelve Lista de productos Paginada
router.get('/products/:pid',productsController.getProduct)//Devuelve un producto
router.post('/products',onlyAuthUsers,productsController.createProduct)//Agrega un producto
router.put('/products/:pid',onlyAuthUsers,productsController.editProduct) //Edita el producto usando req.body.
router.delete('/products/:pid',onlyAuthUsers,allowAccessRolesMiddleware(['admin','premium']),productsController.deleteProduct) //Elimina el producto pid
router.post('/products/list',onlyAuthUsers,productsController.addProductsList) //Agrega una lista de productos. 

router.post('/products/addProductFromRealTimeProductsView', allowAccessRolesMiddleware(['admin','premium']),productsController.addProductFromRealTimeProductsView)