import { IncompleteFieldsError, UsersServiceError, InternalServerError } from "../services/errors/custom-errors.js";
import { logger } from "../utils/loggers/logger.js";


export const manejadorError = (error, req, res, next) => {
    //console.log('LLego al middleware Manejando erroressss')
    if (error instanceof IncompleteFieldsError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: error.message})
        
    } 

    if (error instanceof UsersServiceError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: `Error en servicio de usuarios - ${error.message}`})
        
    } 

    if (error instanceof InternalServerError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: `Error interno del servidor - ${error.message}`})
        
    } 


   

    else res.status(500).json({message: 'otro error'})
}

