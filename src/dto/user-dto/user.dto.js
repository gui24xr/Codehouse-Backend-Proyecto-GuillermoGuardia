import { getMissingFields, getInvalidFieldsList } from "./validation.js";
import { UserDTOERROR } from "../../services/errors.service.js";
import { rolesList } from "./validation.js";



export class UserDTO{
    //Se recibe un objeto con las propiedades necesarias para la creacion de un usuario en la BD.
    //Se controla que esten los campos necesarios para la creacion, de lo contrario se deveulve error UserDTOERROR.INCOMPLETE_FIELDS.
    //Se validan los campos necesarios para la creacion, de lo contrario se deveulve error UserDTOERROR.VALIDATION_ERROR.
    //Si todo salio OK se obtiene una instancia para poder crear un usuario.
    //cartId puede ser null segun el user posea o no posea carro y puede ser seteado mediante el metodo setCart.
    constructor(receivedObject){
        const requiredFieldsForUser = ['userId','email','password','firstName','lastName','age','role'/*,'cartId','lastConnection','documents'*/]     //Control de campos necesarios/obligatorios.
        const missingFields = getMissingFields(receivedObject,requiredFieldsForUser)
        //Teniendo en cuenta que missing fields devuelve un array con los campos faltantes...
        if (missingFields.length > 0) return new UserDTOERROR(UserDTOERROR.INCOMPLETE_FIELDS,'|UserDTO.contructor|',`Campos Faltantes: ${[...missingFields].join('|')}.`)
        //Validacion de campos.
        const invalidFields = getInvalidFieldsList(receivedObject)
        if (invalidFields.length > 0) return new UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.contructor|',`Campos invalidos: ${[...invalidFields].join('|')}.`)
        //Salio todo ok, se construye la instancia.
        // Se construye la instancia.
        //Los campos con opcional null es xq podrian venir vacios en futuras implementaciones.
        this.userId = receivedObject.userId;
        this.email = receivedObject.email;
        this.password = receivedObject.password;
        this.firstName = receivedObject.firstName ? receivedObject.firstName : null;
        this.lastName = receivedObject.lastName ? receivedObject.lastName : null;
        this.age = receivedObject.age ? receivedObject.age : null;
        this.role = receivedObject.role;
        this.cartId = receivedObject.cartId ? receivedObject.cartId : null;
        this.lastConnection = receivedObject.lastConnection ? receivedObject.lastConnection : null;
        this.documents = receivedObject.documents;
    }

    //Cambia el carro del user
    setCart(cartId){
        if (typeof cartId !== 'string') return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.addCart|','Formato cartId no valido.')
        this.cartId = cartId;
    }

      //Cambia el password, no valida condiciones xq eso sera parte de las reglas de la app
      //Y eso en todo momento debe venir oculto a los ojos del dev
      //por lo cual eso tiene que venir encriptado desde que entra a la app.
      //Esta funcin simplemente cambia el password en el user dto y que no sea vacio
      setPassword(newPassword){
        if (typeof newPassword !== 'string' || newPassword == '') return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.setPassword|','Password vacio o tipo de dato incorrecto...')
        this.password = newPassword
    }

    //Setea el role del user y valida que este en los roles permitidos por nuestra app.
    setRole(newUserRole){
        if (typeof newUserRole !== 'string') return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.setRole|','Formato rol no valido.')
        if (!rolesList.includes(newUserRole)) return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.setRole|','Rol no valido.')
        this.role = newUserRole
    }

    //Setea el last_connection previamente verifica que sea un DATE valido.
    setLastConnection(newLastConnetion){
        if (!(newLastConnetion instanceof Date) ) return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.setLastConnection|','Formato lastConnection no valido.')
        this.lastConnection = newLastConnetion
    }

    //Agrega un document al user.
    //Valida y agrega un documento al user.
    //Faltaria validar que docReference sea una cadena path valida.
    addDocument(docName, docReference){
        if (typeof docName !== 'string' || docName == '') return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.addDocument|','Formato document Name vacio o no valido.')
        if (typeof docReference !== 'string' || docName == '') return UserDTOERROR(UserDTOERROR.INVALIDS_FIELDS,'|UserDTO.addDocument|','Formato document Reference vacio o no valido.')
        this.documents.push({name: docName, reference: docReference})
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