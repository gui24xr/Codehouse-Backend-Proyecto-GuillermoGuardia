import { 
    IncompleteFieldsError, 
    UsersServiceError, 
    CartsServiceError, 
    InternalServerError,
    UnauthorizedError,
    TokenVerificationError
 } from "../services/errors/custom-errors.js";
import { logger } from "../utils/loggers/logger.js";


export const handlerErrorsMiddleware = (error, req, res, next) => {
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
        logger.fatal(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: `Error interno del servidor - ${error.message}`})
        
    } 

    
    if (error instanceof CartsServiceError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: `Error en el CartServices - ${error.message}`})
        
    } 

    if (error instanceof UnauthorizedError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(403).json({message: `Unauthorized Error.  - ${error.message}`})
        
    } 

    if (error instanceof TokenVerificationError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: `TokenVerificationError - ${error.message}`})
        
    } 

    //else res.status(500).json({message: 'otro error'})
}

