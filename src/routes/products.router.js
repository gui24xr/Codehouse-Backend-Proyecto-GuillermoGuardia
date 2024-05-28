import express from 'express'
import { authMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { ProductController } from '../controllers/products-controller.js'

//Creo mi router.
export const router = express.Router()
//Todas estas rutas estaran protegidas, se necesita estar con un token valido para ejecutar estos endpoint.
router.use(authMiddleware)
//Creo la instancia.
const productController = new ProductController()


router.get('/products',productController.getProductsListPaginate)//Deveulve paginado
router.get('/productslist',productController.getProducts) //Devuelve lista con o sin limite
router.get('/products/:pid',productController.getProductById)
router.post('/products',productController.addProduct)
router.put('/products/:pid',productController.updateProduct)
router.delete('/products/:pid',productController.deleteProduct)
router.post('/products/addProductFromRealTimeProductsView', productController.addProductFromRealTimeProductsView)
router.get('/products/:id/changestatus',productController.changeProductStatus)

