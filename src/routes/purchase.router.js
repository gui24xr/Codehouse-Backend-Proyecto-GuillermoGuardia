import express from 'express'
import { authMiddleware,blockRoleAccessMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { PurchasesController } from '../controllers/purchases-controller.js'


const purchaseController = new PurchasesController()
export const routerPurchases = express.Router()

//Para que no se pueda comprar sin estar logueado.
routerPurchases.use(authMiddleware)
//Para que no se pueda comprar siendo user premium.
routerPurchases.use(blockRoleAccessMiddleware('premium'))

routerPurchases.post('/purchases/cartpurchase/:cid', purchaseController.cartCheckout)
routerPurchases.post('/purchases/singlepurchase', purchaseController.singlePurchase) //Compra un producto
//Deveulve los tickets, se usara para clientes externos que pidan tickets de users o compras y usandp filtro por query.
//Querys validos --> code,purchaser/userId
routerPurchases.get('/purchases/tickets',purchaseController.getTickets)