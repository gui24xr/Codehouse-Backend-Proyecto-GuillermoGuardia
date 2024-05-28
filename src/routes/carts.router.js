import express from 'express'
import { CartsController } from '../controllers/carts-controller.js'
import { authMiddleware,blockRoleAccessMiddleware } from '../middlewares/authTokenMiddlewares.js'

//Creo mi instancia de objeto Router
export const router = express.Router()
const cartsController = new CartsController()


//Para realizar cualquier funcion de estas es necesariuo estar logueado, o sea tener token
//Para agregar producto al carro no se puede ser user role premium.
router.use(authMiddleware)


router.get('/carts/:cid', cartsController.getCartById)
router.post('/carts',cartsController.createCart)
router.post('/carts/:cid/products/:pid',blockRoleAccessMiddleware('premium'),cartsController.addProductInCart)
router.delete('/carts/:cid/products/:pid',cartsController.deleteProductInCart)
router.delete('/carts/:cid',cartsController.clearCart)
router.put('/carts/:cid',cartsController.addProductListInCart)

//purchaseRoutes.
router.post('/:cid/purchase', cartsController.cartCheckout)

