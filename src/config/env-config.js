import dotenv from 'dotenv'
import { program } from '../utils/commander.js'

//Me traigo los parametros pasados por consola y extraigo el mode
const {mode} = program.opts()


/*----------------------------------------------------------------------------------
ESTE ES EL SCRIPT QUE USO PARA ECHAR A CORRER EL SERVER...
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/app.js --mode desarrollo",
    "start": "node src/app.js --mode produccion"
  },

/*----------------------------------------------------------------------------------*/
//console.log('Mode: ', mode)

//Segunn los parametros ingresados por consola tomo el archivo env elegido y meto sus variables a process.env
dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

//A partir de ahora las variables estan disponibles en process.env

//console.log('process.env: ', process.env)
//Ya puedo leer process.env y construyo un objeto con esa configuracion

/*
const configObject = {
    mongo_url: process.env.MONGO_URL,
    puerto: process.env.PUERTO
}

export {configObject}
*/