import express from 'express'
import { infoUserFromToken, authMiddleware,blockRoleAccessMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { ViewsController } from '../controllers/views-controllers.js'

const viewsController = new ViewsController()

//Divido en 3 routers las vistas por una cuestion de middlewares y diferentes usos.


export const routerPublicViews = express.Router()
export const routerProtectedViews = express.Router()


routerPublicViews.use(infoUserFromToken)

//Vistas publicas
routerPublicViews.get('/',viewsController.viewMainProductsList)

//Si hay un usuario con token valido hay que proteger estas vistas
routerPublicViews.get('/views/register', viewsController.viewRegisterGet)
routerPublicViews.get('/views/login', viewsController.viewLoginGet)




routerProtectedViews.use(authMiddleware)
//vistas privadas
//SI no hay user no se puede acceder 

routerProtectedViews.get('/views/realtimeproducts', blockRoleAccessMiddleware('user'),viewsController.viewRealTimeProducts)
routerProtectedViews.get('/views/chat',blockRoleAccessMiddleware('admin'),viewsController.viewChat)
routerProtectedViews.get('/views/profile', viewsController.viewProfile)
routerProtectedViews.get('/views/carts/:cid', viewsController.viewCart)
routerProtectedViews.get('/views/:tcode/purchase', viewsController.viewPurchase) //Muestra el resultado de una compra ticket

routerProtectedViews.get('/views/tickets/:uid', viewsController.viewTickets) //Muestra todos los tickets de userId

routerProtectedViews.get('/views/products', viewsController.viewProductsList)
routerProtectedViews.get('/views/mainproductslist', viewsController.viewMainProductsList)
routerProtectedViews.get('/views/product/:pid', viewsController.viewProduct)



//Anuladas por cambios en implementacion
//router.post('/views/registrarse', viewsController.viewRegisterPost)
//router.post('/views/login', viewsController.viewLoginPost)

//Eliminar cuando pase al api completamente
//routerProtectedViews.get('/views/:pid/singlepurchase/:qid/:uid', viewsController.viewSinglePurchase) //Compra un producto