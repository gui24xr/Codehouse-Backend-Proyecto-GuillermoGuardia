import express from 'express'
import { UsersController } from '../controllers/users-controller.js'
import { middlewareCurrent } from '../middlewares/infouserfromtoken.js'


export const router = express.Router()
const usersController = new UsersController


router.post('/sessions/registrarse',usersController.createUser)
router.post('/sessions/login',usersController.authenticateUser)
router.post('/sessions/logout', usersController.clearTokenSession)



