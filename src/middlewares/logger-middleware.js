import { logger } from "../utils/loggers/logger.js"

export function addLogger(req,res,next){
    //Agrego el logger como propiedad al objeto req para poder acceder a el desde cualquier req en la app
    req.logger = logger
    //Para que registre en cada peticion de que peticion se trata pongo un mensaje nivel http.
    const messageForLog = `${req.method} ${req.url}}`
    //Ojo aca con modo dev/prod
    req.logger.debug(messageForLog)
    //Continuamos
    next()
 
   
}