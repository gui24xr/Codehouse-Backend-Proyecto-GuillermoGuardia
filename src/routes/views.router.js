import express from 'express'
import { infoUserFromToken,middlewareIsAdmin,middlewareIsUser } from '../middlewares/infouserfromtoken.js'
import { ViewsController } from '../controllers/views-controllers.js'

//Creo la instancia de router.
export const router = express.Router()
router.use(infoUserFromToken)


const viewsController = new ViewsController()

router.get('/',viewsController.viewHome)
router.get('/views/products', viewsController.viewProductsList)
router.get('/views/productslistpaginate', viewsController.viewProductsListPaginate)
router.get('/views/product/:pid', viewsController.viewProduct)
router.get('/views/realtimeproducts', middlewareIsAdmin,viewsController.viewRealTimeProducts)
router.get('/views/chat',middlewareIsUser,viewsController.viewChat)
router.get('/views/registrarse', viewsController.viewRegisterGet)
router.post('/views/registrarse', viewsController.viewRegisterPost)
router.get('/views/login', viewsController.viewLoginGet)
router.post('/views/login', viewsController.viewLoginPost)
router.get('/views/logout', viewsController.viewLogout)
router.get('/views/profile', viewsController.viewProfile)
router.get('/views/carts/:cid', viewsController.viewCart)
router.get('/views/:cid/purchase', viewsController.viewPurchase) //Compra un carro
router.get('/views/:pid/singlepurchase/:qid/:uid', viewsController.viewSinglePurchase) //Compra un producto
router.get('/views/tickets/:uid', viewsController.viewTickets)




