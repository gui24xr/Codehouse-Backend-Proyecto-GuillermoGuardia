import express from 'express'
import { onlyAuthUsers, onlyWithoutAuthToken } from '../middlewares/authTokenMiddlewares.js'
import { SessionsController } from '../controllers/sessions.controller.js'


export const router = express.Router()
const sessionsController = new SessionsController()


router.post('/sessions/register',sessionsController.registerUser)
router.post('/sessions/login',sessionsController.loginUser)
router.get('/sessions/current',sessionsController.currentRoute)

//Para poder hacer logout es necesario estar con un token o sesion activa
router.post('/sessions/logout',onlyAuthUsers, sessionsController.logoutUser)



