//En este modulo estan todas las clases de errores.
//Cada instancia de error va a tener propiedades de tipo de error,modulo donde esta la falla,mensaje opcional
//Mensaje opcional xq el mensaje luego lo dara el server segun el tipo de error


export class UserDTOERROR extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static INCOMPLETE_FIELDS = 1;
    static INVALIDS_FIELDS = 2;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'UserDTOERROR';
        this.code = errorCode || CartDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

//Para cuando falta se ingresen campos.
export class IncompleteFieldsError extends Error{
    constructor(message){
        super(message)
        this.name = 'IncompleteFieldsError'
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
    static WRONG_PASSWORD = 7;
    
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'UsersServiceError';
        this.code = errorCode || UsersServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}


//Todos los errore de lo que tiene que ver con el servicio de cualquier capa de carts
export class CartsServiceError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static CLEAR_CART_ERROR = 1;
    static NO_CART_DTO_VALID = 2; //No llego un userDTO
    static ADD_ERROR = 3;
    static CART_NO_EXIST = 4;
    static UPDATING_ERROR = 5;
    static DELETING_ERROR = 6;
    static CREATE_ERROR = 7;
    
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'CartsServiceError';
        this.code = errorCode || UsersServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class CartDTOERROR extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static WRONG_PRODUCTS_ARRAY = 1;
    static WRONG_FORMAT_ID = 2;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'UserDTOERROR';
        this.code = errorCode || CartDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}


export class DeliveryPointsServiceError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static CLEAR_CART_ERROR = 1;
    static NO_CART_DTO_VALID = 2; //No llego un userDTO
    static ADD_ERROR = 3;
    static CART_NO_EXIST = 4;
    static UPDATING_ERROR = 5;
    static DELETING_ERROR = 6;
    static CREATE_ERROR = 7;
    
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'DeliveryPointsServiceError';
        this.code = errorCode || DeliveryPointsServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class DeliveryPointDTOERROR extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static WRONG_PRODUCTS_ARRAY = 1;
    static WRONG_FORMAT_ID = 2;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'DeliveryPointDTOERROR';
        this.code = errorCode || DeliveryPointDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

