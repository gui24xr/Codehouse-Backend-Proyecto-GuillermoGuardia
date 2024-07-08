
import { logger } from "../utils/loggers/logger.js";

import { 
        IncompleteFieldsError,
        UsersServiceError,
        CartsServiceError,
        InputValidationServiceError,
        ProductsServiceError,
        InternalServerError,
        UnauthorizedError

 } from "../services/errors.service.js";


export const handlerErrorsMiddleware = (error, req, res, next) => {
    //console.log('LLego al middleware Manejando erroressss')
    if (error instanceof InputValidationServiceError){
       // logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: error.message})
        
    } 

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
        
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        
        if (error.code == UnauthorizedError.NO_USER) 
            res.status(403).json({
                message: `Es necesesario inciar sesion para poder acceder...`,
                url: req.originalUrl
        })

        if (error.code == UnauthorizedError.INVALID_ROLE) 
            res.status(403).json({
                message: `Usuario no autorizado a realizar esta funcion...`,
                url: req.originalUrl
        })
        
    } 
/*
    if (error instanceof TokenVerificationError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: `TokenVerificationError - ${error.message}`})
        
    } */

    //else res.status(500).json({message: 'otro error'})
}

