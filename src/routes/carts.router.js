import express from 'express'
import { CartsController } from '../controllers/carts-controller.js'

//Creo mi instancia de objeto Router
export const router = express.Router()
const cartsController = new CartsController()

router.get('/carts/:cid', cartsController.getCartById)
router.post('/carts',cartsController.createCart)
router.post('/carts/:cid/products/:pid',cartsController.addProductInCart)
router.delete('/carts/:cid/products/:pid',cartsController.deleteProductInCart)
router.delete('/carts/:cid',cartsController.clearCart)
router.put('/carts/:cid',cartsController.addProductListInCart)

//purchaseRoutes.
router.post('/:cid/purchase', cartsController.cartCheckout)

