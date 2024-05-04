import express from 'express'
import { UsersController } from '../controllers/users-controller.js'
import { middlewareCurrent } from '../middlewares/infouserfromtoken.js'


export const router = express.Router()
const usersController = new UsersController


router.post('/api/sessions/registrarse',usersController.createUser)
router.post('/api/sessions/login',usersController.authenticateUser)
router.post('/api/sessions/logout', usersController.clearTokenSession)
router.get('/current',middlewareCurrent,usersController.currentRoute)


