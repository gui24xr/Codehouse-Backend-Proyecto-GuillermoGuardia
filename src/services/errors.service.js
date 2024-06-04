//En este modulo estan todas las clases de errores.
//Cada instancia de error va a tener propiedades de tipo de error,modulo donde esta la falla,mensaje opcional
//Mensaje opcional xq el mensaje luego lo dara el server segun el tipo de error


export class UserDTOERROR extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static INCOMPLETE_FIELDS = 1;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'UserDTOERROR';
        this.code = errorCode || CartDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

//Todos los errore de lo que tiene que ver con el servicio de cualquier capa de usuarios
export class UsersServiceError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static INCOMPLETE_FIELDS = 1;
    static NO_USER_DTO_VALID = 2; //No llego un userDTO
    static USER_EXIST_IN_DATABASE = 3;
    static USER_NO_EXIST = 4;
    static UPDATING_ERROR = 5;
    static DELETING_ERROR = 6;
    
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'UsersServiceError';
        this.code = errorCode || UsersServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}