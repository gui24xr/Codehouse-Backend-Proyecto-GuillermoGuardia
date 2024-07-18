import express from 'express'
import { onlyAuthUsers,onlyWithoutAuthToken,blockRoleAccessMiddleware,allowAccessRolesMiddleware } from '../middlewares/authTokenMiddlewares.js'
import {ViewsController} from '../controllers/views.controllers.js'

const viewsController = new ViewsController()

//Divido en 3 routers las vistas por una cuestion de middlewares y diferentes usos.
export const router = express.Router()




//Vistas no protegidas
router.get('/',viewsController.viewMainProductsList)

//Si hay un usuario con token valido se protegen estas rutas.
router.get('/views/register', onlyWithoutAuthToken,viewsController.viewRegisterGet)
router.get('/views/login', onlyWithoutAuthToken,viewsController.viewLoginGet)


//Vistas que necesitan tenter autorizacion del token para ingresar.
router.get('/views/products/:pid', viewsController.viewProductDetail)
router.get('/views/realtimeproducts', onlyAuthUsers,blockRoleAccessMiddleware('user'),viewsController.viewRealTimeProducts)
router.get('/views/chat',onlyAuthUsers,blockRoleAccessMiddleware('admin'),viewsController.viewChat)
router.get('/views/profile', onlyAuthUsers,viewsController.viewProfile)
router.get('/views/carts/:cid', onlyAuthUsers,viewsController.viewCart)
router.get('/views/:tcode/purchase', onlyAuthUsers, viewsController.viewPurchase) //Muestra el resultado de una compra ticket
router.get('/views/tickets/:uid', onlyAuthUsers,viewsController.viewTickets) //Muestra todos los tickets de userId
router.get('/views/users',onlyAuthUsers,allowAccessRolesMiddleware('admin'), viewsController.viewUsersList)



//Anuladas por cambios en implementacion
//router.post('/views/registrarse', viewsController.viewRegisterPost)
//router.post('/views/login', viewsController.viewLoginPost)

//Eliminar cuando pase al api completamente
//router.get('/views/:pid/singlepurchase/:qid/:uid', viewsController.viewSinglePurchase) //Compra un producto