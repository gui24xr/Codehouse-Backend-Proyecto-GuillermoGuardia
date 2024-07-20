
import { logger } from "../utils/loggers/logger.js";

import { 
        IncompleteFieldsError,
        UsersServiceError,
        CartsServiceError,
        InputValidationServiceError,
        ProductsServiceError,
        InternalServerError,
        UnauthorizedError,
        CheckoutsServiceError

 } from "../services/errors.service.js";


export const handlerErrorsMiddleware = (error, req, res, next) => {
    //console.log('LLego al middleware Manejando erroressss',error)

    logger.error(`Type:${typeof(error)} `)
    
    if (error instanceof InputValidationServiceError){
       // logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        res.status(500).json({message: error.message})
        
    } 

    if (error instanceof ProductsServiceError){
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
        console.log('LLego al middleware Manejando erroressss')
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        
        if (error.code == CartsServiceError.BLOCKED_TO_PREMIUM_USERS) 
            res.status(403).json({
                message: `Operacion no permitida para usuarios premium. Se inento agregar un producto prodpio a su carro.`,
                url: req.originalUrl
        })



        
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

        if (error.code == UnauthorizedError.USER_LOGGED_EXIST) 
            res.status(403).json({
                message: `Es necesario cerrar sesion para iniciar una nueva sesion o registrar un nuevo usuario...`,
                url: req.originalUrl
        }) 
        
    } 


    if (error instanceof CheckoutsServiceError){
        
        logger.error(`Type:${error.name} in ${req.method} - ${req.originalUrl} from ${req.ip}`)
        
        if (error.code == CheckoutsServiceError.CART_WITHOUT_PRODUCTS) 
            res.status(403).json({
                message: `No se puede hacer un checkout sobre un carro vacio`,
                url: req.originalUrl
        })

        if (error.code == CheckoutsServiceError.PRODUCT_NO_EXIST) 
            res.status(403).json({
                message: `El producto no existe`,
                url: req.originalUrl
        })

        if (error.code == CheckoutsServiceError.PRODUCT_WITHOUT_STOCK) 
            res.status(403).json({
                message: `En este momento el producto no tiene la cantidad suficiente en stock para realizar esta compra...`,
                url: req.originalUrl
        })

        if (error.code == CheckoutsServiceError.OWNER_PRODUCT_USER) 
            res.status(403).json({
                message: `El producto no puede ser comprado ya que el usuario registrado es su owner...`,
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

