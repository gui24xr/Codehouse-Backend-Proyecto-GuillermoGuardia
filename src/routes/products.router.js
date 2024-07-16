import express from 'express'
import { onlyAuthUsers, allowAccessRolesMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { ProductsController } from '../controllers/products.controller.js'

//Creo mi router.
export const router = express.Router()
//Todas estas rutas estaran protegidas, se necesita estar con un token valido para ejecutar estos endpoint.
//---RESTABLECER router.use(authMiddleware)
//Creo la instancia.
const productsController = new ProductsController()

/*
//Sumar un endpoijt para agregar listas de productos
router.get('/products',productController.getProductsListPaginate)//Deveulve paginado
router.get('/productslist',productController.searchProducts) //Devuelve lista con o sin limite
router.get('/products/:pid',productController.getProductById)
router.post('/products',allowAccessRolesMiddleware(['admin','premium']),productController.addProduct)
router.put('/products/:pid',productController.updateProduct)
router.delete('/products/:pid',productController.deleteProduct)
router.post('/products/addProductFromRealTimeProductsView', allowAccessRolesMiddleware(['admin','premium']),productController.addProductFromRealTimeProductsView)
router.get('/products/:id/changestatus',productController.changeProductStatus)
router.post('/products/add', productController.addProduct2)
*/

router.get('/products',productsController.searchProducts)//Devuelve Lista de productos Paginada
router.get('/products/:pid',productsController.getProduct)//Devuelve un producto
router.post('/products',onlyAuthUsers,productsController.createProduct)//Agrega un producto
router.put('/products/:pid',onlyAuthUsers,productsController.editProduct) //Edita el producto usando req.body.
router.delete('/products/:pid',onlyAuthUsers,productsController.deleteProduct) //Elimina el producto pid
router.post('/products/list',onlyAuthUsers,productsController.addProductsList) //Agrega una lista de productos. 
