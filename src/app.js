import './config/env-config.js' //Se ejecuta para levantar variables de entorno desde consola.

import express  from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from 'cors'

//Importacion de configuraciones
import { configHandlebars } from "./config/handlebars-config.js"
import { initDataBaseConnection } from "./config/database.js"
// import { configSessionMongo } from "./config/sessions-config.js"; En desuso, se adopto totalmente JWT
import { initializePassport } from "./config/passport.config.js"

// Importacion de middlewares.
import { loggerMiddleware } from './middlewares/logger-middleware.js'
import { verifyTokenMiddleware } from './middlewares/authTokenMiddlewares.js';
import { routerPublicViews } from './routes/views.router.js';
import { routerProtectedViews } from './routes/views.router.js';
import {router as routerCarts } from './routes/carts.router.js'
import {router as routerProducts} from './routes/products.router.js'
import {router as routerSessions} from './routes/sessions.router.js'
import {router as routerUsers} from './routes/users.router.js'
import {router as routerTesting} from './routes/testing.router.js'
import {router as routerPruebas} from './routes/pruebas.router.js' //Interno para pruebas
import { routerPurchases } from './routes/purchase.router.js';

import { SocketManager } from "./socket/socketmanager.js";
import { handlerErrorsMiddleware } from './middlewares/handler-errors-middleware.js';


//crecion de instancia de express.
const PUERTO = process.env.PORT || 8081
export const app = express()

//expressMiddlewares
app.use(express.static('./src/public')) //Configuracion carpeta public
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIES_SIGN))


//Configuraciones generales y puesta en marcha de BD.
configHandlebars(app)
initDataBaseConnection()
initializePassport()


//Middlewares generales
app.use(loggerMiddleware) //Para tener registro del flujo.
app.use(verifyTokenMiddleware) //En cada solicitud verifica la existencia de token y nos provee de req.currentUser.

//Usos de rutas.
app.use('/',routerPublicViews)
app.use('/',routerProtectedViews)
app.use('/api',routerCarts) 
app.use('/api',routerProducts)
app.use('/api',routerSessions)
app.use('/api', routerUsers)
app.use('/api', routerPurchases)
app.use('/',routerTesting) //Rutas testing consignas.
app.use('/pruebas', routerPruebas) //Rutas testing personal.


/*Este middleware solo entrara cuando algun middleware anterior envie una instancia de error
 Por dicha razon va luego de todos los middlewares y rutas.
*/
app.use(handlerErrorsMiddleware)



//Creo una referencia y pongo el server a escuchar.
const httpServer = app.listen(PUERTO,()=>{
    console.log(`Escuchando en puerto ${PUERTO}`)
})

//Configuracion e inicio de websockets.
//initSocket(httpServer)
export const mySocketServer = new SocketManager(httpServer);
mySocketServer.initSocketEvents()

//Conexion por sockets.
//export const io = new Server(httpServer)
