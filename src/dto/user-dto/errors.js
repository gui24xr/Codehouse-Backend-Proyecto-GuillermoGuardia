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
