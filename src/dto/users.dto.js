
//Este objeto representa la forma de los objetos usuario
import { UserDTOERROR } from "../services/errors.service.js"

export class UserDTO{
    //Falta validar roles ueque a futuro vendran de variables de entorno.
    constructor(userId,email,password,first_name,last_name,age,userRole,cartId=null){

        //Tenemos que controlar que vengan los parametros obligatorios, sino tirar excepcion.
        //Tenemos que lanzar error si el role no existe. Validaciones a futuro.
        try{
            //if (!userId || !email || !password || !first_name ||!last_name ||!age || !userRole || !cartId ) throw new UserDTOERROR(UserDTOERROR.INCOMPLETE_FIELDS,'|UserDTO.constructor|')
            
            this.userId = userId;
            this.email = email;
            this.password = password;
            this.first_name = first_name;
            this.last_name = last_name;
            this.age = age;
            this.role = userRole;
            this.cartId = cartId;
        }catch(error){
            if (error instanceof UserDTOERROR) throw error
            else throw new UserDTOERROR(UserDTOERROR.INTERNAL_SERVER_ERROR,'|UserDTO.constructor|')
        }
        }

    static prepareUserObject(email,password,first_name,last_name,userRole,age){
        //Devuelve un objeto  para enviarle a la capa de persistencia y crear un user con estos datos.
        //Este objeto tendria esos datos solamente, serian los de un tipico form
        //Si a futuro queremos escalar ponemos mas datos en los parametros.
        //Tenemos que controlar que vengan los parametros obligatorios, sino tirar excepcion.
        //Tenemos que lanzar error si el role no existe. Validaciones a futuro.
        try{

            if ( !email || !password || !first_name ||!last_name ||!age  ) throw new UserDTOERROR(UserDTOERROR.INCOMPLETE_FIELDS,'|UserDTO.prepareUserObject|')
            return {
                email:email,
                first_name:first_name,
                last_name: last_name,
                userRole: userRole || 'user'
            }
        }catch(error){
            if (error instanceof UserDTOERROR) throw error
            else throw new UserDTOERROR(UserDTOERROR.INTERNAL_SERVER_ERROR,'|UserDTO.prepareUserObject|')
        }
    }

    //Podria user gets y sets pero mas adelante. Por ahora accedo directo a las propiedades


}