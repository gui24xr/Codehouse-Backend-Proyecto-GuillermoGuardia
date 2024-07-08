import express from 'express'
import { authMiddleware, allowAccessRolesMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { ProductController } from '../controllers/products.controller.js'

//Creo mi router.
export const router = express.Router()
//Todas estas rutas estaran protegidas, se necesita estar con un token valido para ejecutar estos endpoint.
router.use(authMiddleware)
//Creo la instancia.
const productController = new ProductController()

//Sumar un endpoijt para agregar listas de productos
router.get('/products',productController.getProductsListPaginate)//Deveulve paginado
router.get('/productslist',productController.getProducts) //Devuelve lista con o sin limite
router.get('/products/:pid',productController.getProductById)
router.post('/products',allowAccessRolesMiddleware(['admin','premium']),productController.addProduct)
router.put('/products/:pid',productController.updateProduct)
router.delete('/products/:pid',productController.deleteProduct)
router.post('/products/addProductFromRealTimeProductsView', allowAccessRolesMiddleware(['admin','premium']),productController.addProductFromRealTimeProductsView)
router.get('/products/:id/changestatus',productController.changeProductStatus)
router.post('/products/add', productController.addProduct2)

