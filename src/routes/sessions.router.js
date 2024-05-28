import express from 'express'
import { authMiddleware } from '../middlewares/authTokenMiddlewares.js'
import { UsersController } from '../controllers/users-controller.js'



export const router = express.Router()
const usersController = new UsersController


router.post('/sessions/register',usersController.createUser)
router.post('/sessions/login',usersController.authenticateUser)

//Para poder hacer logout es necesario estar con un token o sesion activa
router.post('/sessions/logout', authMiddleware, usersController.clearTokenSession)



