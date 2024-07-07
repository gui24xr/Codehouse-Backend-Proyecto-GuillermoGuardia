import express from 'express'
import { UsersController } from '../controllers/users.controller.js'
import { authMiddleware } from '../middlewares/authTokenMiddlewares.js'


//Creo mi instancia de objeto Router
export const router = express.Router()
const usersController = new UsersController()


//Para poder ingresar a esta ruta es necesario ser admin, la protejo con este middleware.
//router.use(authMiddleware)


router.get('/users',usersController.getUsers)
router.delete('/users/delete/inactive',usersController.deleteInactiveUsers)
router.delete('/users', usersController.deleteUser) //Borra al user pasado por query
router.patch('/users/rol',usersController.updateUserRole)
router.post('/users/recoverypassword',usersController.createRecoveryCode)
router.post('/users/resetpassword',usersController.changeUserPassword)

