//Creamos una clase para crear errores propios
//Le fabricamos un metodo estatico para crear errores.

export class CustomError{
    static createError(errorName,errorCause,errorMessage,errorDescription){
        const error = new Error(errorMessage)
        //Como es un objeto le puedo setear propiedades..
        error.name = errorName
        error.cause = errorCause
        error.description = errorDescription
        //Lanzamos el error el cual detiene la ejecucion
        //Recordar capturar el error con try/catch en otro modulo....
        throw error
    }
}


export class validationError extends Error{
    constructor(message){
        super(message)
        this.name = 'validationError'
    }
}






//Para cuando falta se ingresen campos.
export class IncompleteFieldsError extends Error{
    constructor(message){
        super(message)
        this.name = 'IncompleteFieldsError'
    }
}

//Errores relacionados al servicio de usuarios
export class UsersServiceError extends Error{
    //Constantes tipo de errores servicio de usuarios.
    static INTERNAL_ERROR = 0
    static AUTH_ERROR = 1
    static REGISTER_ERROR = 2
    
    constructor(errorCode,message){
        super(message)
        this.name = 'UsersServiceErrors'
        this.errorCode = errorCode
    }
   
}

//Errores relacionados al servicio de usuarios
export class ProductsServiceError extends Error{
    //Constantes tipo de errores servicio de usuarios.
    static PRODUCT_EXIST = 0
    static PROCUT_NO_EXIST = 1
    static PRODUCT_NO_STOCK = 2
   
    
    constructor(errorCode,message){
        super(message)
        this.name = 'ProductsServiceError'
        this.errorCode = errorCode
    }
   
}

export class CartsServiceError extends Error{
    //Constantes tipo de errores servicio de usuarios.
    static NO_EXIST = 0
    static CREATE_ERROR = 1
    static PRODUCT_NO_DELETED = 2
    static PRODUCT_NO_ADD = 3
   
    
    constructor(errorCode,message){
        super(message)
        this.name = 'CartsServiceError'
        this.errorCode = errorCode
    }

   
}

export class TicketsServiceError extends Error{
    //Constantes tipo de errores servicio de usuarios.
    static NO_EXIST = 0
    static CREATE_ERROR = 1
     
    
    constructor(errorCode,message){
        super(message)
        this.name = 'TicketsServiceError'
        this.errorCode = errorCode
    }

}
export class CheckoutServiceError extends Error{
    //Constantes tipo de errores servicio de usuarios.
    static NULL_CART = 0
    static CREATE_ERROR = 1
    static NO_STOCK = 2
     
    
    constructor(errorCode,message){
        super(message)
        this.name = 'CheckoutServiceError'
        this.errorCode = errorCode
    }

}
//Errores relacionados al servicio de usuarios
export class InternalServerError extends Error{
    //Constantes tipo de errores servicio de usuarios.
    static GENERIC_ERROR = 0
    constructor(errorCode,message){
        super(message)
        this.name = 'InternalServerError'
        this.errorCode = errorCode
    }
   
}



