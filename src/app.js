import express  from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from 'passport'

import cors from 'cors'
import { configHandlebars } from "./config/handlebars-config.js"
import { initDataBaseConnection } from "./config/database.js";
import { configSessionMongo } from "./config/sessions-config.js";
import { initializePassport } from "./config/passport.config.js";

// Importacion de rutas.
import {router as routerViews} from './routes/views.router.js'
import {router as routerCarts } from './routes/carts.router.js'
import {router as routerProducts} from './routes/products.router.js'
import {router as routerSessions} from './routes/sessions.router.js'
import {router as routerPruebas} from './routes/pruebas.router.js' //Interno para pruebas

import { addSessionData } from "./middlewares/middlewares.js";
import { SocketManager } from "./socket/socketmanager.js";

//PRUEBA SQLITE3
//import { connectToSqlite3 } from "./config/sqliteconnect.js";
//import { SQLProductsDAO } from "./dao/sqlite.products.dao.js";
//const unaInstancia = new SQLProductsDAO()
//console.log(unaInstancia.getProducts())

//crecion de instancia de express.
const PUERTO = 8080
export const app = express()



//Configuracion carpeta public
app.use(express.static('./src/public'));

//Middlewares
app.use(express.json())

app.use(express.urlencoded({extended:true}))
app.use(cors());


// Configurar el middleware de análisis del cuerpo para procesar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('firmasecreta'))



//Configuraciones:
//Pongo a funcionar la conexion a la BD.
//connectToSqlite3()
initDataBaseConnection()
configHandlebars(app)
//configSessionMongo(app) //Fuera de servicio por dejar de usar session
//importante este middleware este aca xq tiene variables de session
app.use(addSessionData)

//app.use(passport.initialize());
initializePassport();
//app.use(addSessionData)

//Routes : le decimos a la app de express que debe usar las rutas de los router
app.use('/',routerViews)
app.use('/',routerCarts) 
app.use('/',routerProducts)
app.use('/',routerSessions)
app.use('/pruebas', routerPruebas)

 ////////////////////////////////////////////////////////

//app.use(passport.session());
        ///////////////////////////////////////////////////////////

//Creo una referencia y pongo el server a escuchar en puerto 8080.
const httpServer = app.listen(PUERTO,()=>{
    console.log(`Escuchando en puerto ${PUERTO}`)
})

//Configuracion e inicio de websockets.
//initSocket(httpServer)
export const mySocketServer = new SocketManager(httpServer);
mySocketServer.initSocketEvents()

//Conexion por sockets.
//export const io = new Server(httpServer)
