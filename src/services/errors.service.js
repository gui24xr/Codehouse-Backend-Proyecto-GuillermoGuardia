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

export class InputValidationServiceError extends Error{
    static INTERNAL_SERVER_ERROR = 0;
    static INCOMPLETE_FIELDS = 1;
    static INVALID_VALUES = 2; //No llego un userDTO
    static INVALID_PRODUCT_LIST = 3;
    static INVALID_PRODUCT_ITEM = 4;

    
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'InputValidationServiceError';
        this.code = errorCode || InputValidationServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
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
    static WRONG_PASSWORD = 7;
    static GET_ERROR = 8;
    static BLOCKED_TO_PREMIUM_USERS = 9;
    static INCOMPLETE_REQUIREMENTS_FOR_CHANGE_ROL = 10;
    
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
    static INVALID_PRODUCTS_LIST = 8;
    static GET_ERROR = 8;
    static UPDATING_PRODUCT_QUANTITY_ERROR = 9;
    static DELETING_PRODUCT_IN_CART_ERROR = 10;
    static BLOCKED_TO_PREMIUM_USERS = 11;
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
    static EDIT_DTO_ERROR = 3;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'UserDTOERROR';
        this.code = errorCode || CartDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}


export class ExchangePointsServiceError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static CREATE_ERROR = 1;
    static NO_EXCHANGE_POINT_DTO_VALID = 2; //No llego un userDTO
    static ADD_ERROR = 3;
    static EXCHANGE_POINT_NO_EXIST = 4;
    static UPDATING_ERROR = 5;
    static DELETING_ERROR = 6;
    static GET_ERROR = 7;

   
    
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'ExchangePointsServiceError';
        this.code = errorCode || ExchangePointsServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class ExchangePointDTOERROR extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static INVALIDS_FIELDS = 1;
    static MISSING_FIELDS = 2;
    static EDIT_DTO_ERROR = 3;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'DeliveryPointDTOERROR';
        this.code = errorCode || ExchangePointDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class ProductsServiceError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static CREATE_ERROR = 1;
    static ADD_ERROR = 2;
    static UPDATING_ERROR = 3;
    static DELETING_ERROR = 4;
    static GET_ERROR = 5;
    static PRODUCT_NO_EXIST = 6;
    static PRODUCT_WITH_SAME_CODE_ALREADY_EXIST = 7;
    static NO_CONSTRUCTION_OBJECT = 8;

    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'ProductsServiceError';
        this.code = errorCode || ProductsServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class ProductDTOERROR extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static INVALIDS_FIELDS = 1;
    static MISSING_FIELDS = 2;
    static EDIT_DTO_ERROR = 3;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'ProductDTOERROR';
        this.code = errorCode || ProductDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class UnauthorizedError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static NO_USER = 1;
    static INVALID_ROLE = 2;
    static USER_LOGGED_EXIST= 3;
 
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'UnauthorizedError';
        this.code = errorCode || UnauthorizedError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}


export class TokenVerificationError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static GENERIC_ERROR = 1;

 
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'TokenVerificationError';
        this.code = errorCode || TokenVerificationError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}


export class TicketsServiceError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static GENERIC_ERROR = 1;

 
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'TicketsService';
        this.code = errorCode || TicketsService.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class CheckoutsServiceError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static GENERIC_ERROR = 1;
    static CART_WITHOUT_PRODUCTS = 2;
    static CREATE_TICKET_ERROR = 3;
    static GET_TICKET_ERROR = 4;
    static UPDATE_TICKET_ERROR = 5;
    static PRODUCT_WITHOUT_STOCK= 6;
    static PRODUCT_NO_EXIST= 7;
    static OWNER_PRODUCT_USER = 8;

 
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'CheckoutsServiceError';
        this.code = errorCode || CheckoutsServiceError.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}

export class InternalServerError extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static GENERIC_ERROR = 1;

 
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'TicketsService';
        this.code = errorCode || TicketsService.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}


export class TicketDTOERROR extends Error{

    //Codigos posibles.
    static INTERNAL_SERVER_ERROR = 0;
    static INCOMPLETE_FIELDS = 1;
    static INVALIDS_FIELDS = 2;
    constructor(errorCode,operationName,message){
        super(message);
        this.name = 'TicketDTOERROR';
        this.code = errorCode || TicketDTOERROR.INTERNAL_SERVER_ERROR; //una constante static de codigo
        this.operationName = operationName; //Funcion donde se dio la falla
    }
}