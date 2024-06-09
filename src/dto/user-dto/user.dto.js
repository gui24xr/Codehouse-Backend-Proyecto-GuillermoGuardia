import { getMissingFields, getInvalidFieldsList } from "./validation.js";
import { UserDTOERROR } from "./errors.js"


export class UserDTO{
    //Se recibe un objeto con las propiedades necesarias para la creacion de un usuario en la BD.
    //Se controla que esten los campos necesarios para la creacion, de lo contrario se deveulve error UserDTOERROR.INCOMPLETE_FIELDS.
    //Se validan los campos necesarios para la creacion, de lo contrario se deveulve error UserDTOERROR.VALIDATION_ERROR.
    //Si todo salio OK se obtiene una instancia para poder crear un usuario.
    //cartId puede ser null segun el user posea o no posea carro y puede ser seteado mediante el metodo setCart.
    constructor(receivedObject){
        const requiredFieldsForUser = ['userId','email','password','firstName','lastName','age','role',/*'cartId'*/]
        //Control de campos necesarios/obligatorios.
        const missingFields = getMissingFields(receivedObject,requiredFieldsForUser)
        //Teniendo en cuenta que missing fields devuelve un array con los campos faltantes...
        if (missingFields.length > 0) return new UserDTOERROR(UserDTOERROR.INCOMPLETE_FIELDS,'|UserDTO.contructor|',`Campos Faltantes: ${[...missingFields].join('|')}.`)
        //Validacion de campos.
        const invalidFields = getInvalidFieldsList(receivedObject)
        if (invalidFields.length > 0) return new UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.contructor|',`Campos invalidos: ${[...invalidFields].join('|')}.`)
        //Salio todo ok, se construye la instancia.
        this.userId = receivedObject.userId;
        this.email = receivedObject.email;
        this.password = receivedObject.password;
        this.firstName = receivedObject.firstName;
        this.lastName = receivedObject.lastName;
        this.age = receivedObject.age;
        this.role = receivedObject.role;
        this.cartId = receivedObject.cartId;
    }

    //Agrega un carro al objeto UserDTO y previamente lo valida.
    setCart(cartId){
        if (typeof cartId !== 'string') return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.addCart|','Formato cartId no valido.')
        this.cartId = cartId;
    }
}


export class CreateUserDTO{
    //Se recibe un objeto con las propiedades necesarias para la creacion de un usuario en la BD.
    //Se controla que esten los campos necesarios para la creacion, de lo contrario se deveulve error UserDTOERROR.INCOMPLETE_FIELDS.
    //Se validan los campos necesarios para la creacion, de lo contrario se deveulve error UserDTOERROR.VALIDATION_ERROR.
    //Si todo salio OK se obtiene una instancia para poder crear un usuario.
    constructor(receivedObject){
        const requiredFieldsForCreateUser = ['email','password','firstName','lastName','age','role']
        //Control de campos necesarios/obligatorios.
        const missingFields = getMissingFields(receivedObject,requiredFieldsForCreateUser)
        //Teniendo en cuenta que missing fields devuelve un array con los campos faltantes...
        if (missingFields.length > 0) return new UserDTOERROR(UserDTOERROR.INCOMPLETE_FIELDS,'|CreateUserDTO.contructor|',`Campos Faltantes: ${[...missingFields].join('|')}.`)
        //Validacion de campos.
        const invalidFields = getInvalidFieldsList(receivedObject)
        if (invalidFields.length > 0) return new UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|CreateUserDTO.contructor|',`Campos invalidos: ${[...invalidFields].join('|')}.`)
        //Salio todo ok, se construye la instancia.
        this.email = receivedObject.email;
        this.password = receivedObject.password;
        this.firstName = receivedObject.firstName;
        this.lastName = receivedObject.lastName;
        this.age = receivedObject.age;
        this.role = receivedObject.role;
    }
}