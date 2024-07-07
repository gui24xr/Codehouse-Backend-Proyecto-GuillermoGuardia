import express from 'express'
import { UsersController } from '../controllers/users-controller.js'
import { ViewsController } from '../controllers/views-controllers.js'
import { authMiddleware } from '../middlewares/authTokenMiddlewares.js'


//Creo mi instancia de objeto Router
export const router = express.Router()
const usersController = new UsersController()


//Para poder ingresar a esta ruta es necesario ser admin, la protejo con este middleware.
//router.use(authMiddleware)


router.get('/users/get',usersController.getUsers)
router.delete('/users/delete',usersController.deleteInactiveUsers)
//router.get('/updateusersrol',viewsController.viewTickets)