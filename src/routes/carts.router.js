import express from 'express'
import { CartsController } from '../controllers/carts.controller.js'
import { onlyAuthUsers,blockRoleAccessMiddleware} from '../middlewares/authTokenMiddlewares.js'

//Creo mi instancia de objeto Router
export const router = express.Router()
const cartsController = new CartsController()


//Para realizar cualquier funcion de estas es necesariuo estar logueado, o sea tener token
//Para agregar producto al carro no se puede ser user role premium.



router.get('/carts/:cid', onlyAuthUsers,cartsController.getCartById)
router.post('/carts',onlyAuthUsers,cartsController.createCart)
router.post('/carts/:cid/products/:pid',onlyAuthUsers,cartsController.addProductInCart)
router.delete('/carts/:cid/products/:pid',onlyAuthUsers,cartsController.deleteProductFromCart)
router.delete('/carts/:cid',onlyAuthUsers,cartsController.clearCart)
router.put('/carts/:cid',onlyAuthUsers,cartsController.addProductListInCart)

//purchaseRoutes.
router.post('/:cid/purchase',onlyAuthUsers, cartsController.cartCheckout)

//Esta ruta es para la compra simple.