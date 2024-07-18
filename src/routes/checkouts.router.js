import express from 'express'
import { onlyAuthUsers,blockRoleAccessMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { CheckoutsController } from '../controllers/checkouts.controller.js'

export const router = express.Router()

const checkoutsController = new CheckoutsController()

router.post('/carts/checkout/:cid', onlyAuthUsers,checkoutsController.cartCheckout)
router.post('/products/checkout/:pid', onlyAuthUsers,checkoutsController.singlePurchase) //Compra un producto
//Deveulve los tickets, se usara para clientes externos que pidan tickets de users o compras y usandp filtro por query.
//Querys validos --> code,userId
router.get('/checkout/tickets',checkoutsController.getTickets)