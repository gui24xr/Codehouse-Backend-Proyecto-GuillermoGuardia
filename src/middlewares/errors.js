import { IncompleteFieldsError, usersServiceError, AuthServiceError } from "../services/errors/custom-errors.js";
import { logger } from "../utils/loggers/logger.js";


export const manejadorError = (error, req, res, next) => {
    if (error instanceof IncompleteFieldsError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: error.message})
        
    } 

    if (error instanceof usersServiceError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: error.message})
        
    } 

    if (error instanceof AuthServiceError){
        //console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: error.message})
        
    } 

    else res.status(500).json({message: 'otro error'})
}

