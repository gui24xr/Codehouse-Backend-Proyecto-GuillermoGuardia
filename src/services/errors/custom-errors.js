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
export class usersServiceError extends Error{
    constructor(message){
        super(message)
        this.name = 'usersServiceErrors'
    }
}

//Errores relacionados al errores de autenticacion
export class AuthServiceError extends Error{
    constructor(message){
        super(message)
        this.name = 'usersServiceErrors'
    }
}
