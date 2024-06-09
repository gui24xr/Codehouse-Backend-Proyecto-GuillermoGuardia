import { UsersDAO } from "../dao/factory.js";
import { UsersServiceError } from "../services/errors.service.js";
import { CreateUserDTO, UserDTO } from "../dto/user-dto/user.dto.js";

const usersDAO = new UsersDAO()

//Voy a usar la logica
//service le pide a repository que cree un usuario
//repository le dice 'Queres un user con carro? pasame un objeto asi y asi
//Si querers que sea sin carro deja la propiedad cartId vacia(modificar eso)
//Yo te devuelvo un objeto user dto entero
//Y si llego a haber un error en la creacion del carro te doy un error tal, miralo en tu throw
//O sea si vino ese error borra el carro que creaste para no ensuciar la BD
//entoncs repository va a mirar si hay id o no y de acuerdo a eso lo crea con carro
//ertonces repository mira
//Tiene cartId entonces hace crud.crearConcarro, no tiene cartId le dice crearSinCarro
// si hay error en la creacion xq el user existia o otro error hay qe borrar el carro creado
export class UsersRepository{


    //Recibe una instancia de CreateUserDTO, la valida y extrae sus propiedades para hacer el crud.
    //Recibe lo devuelto por la capa de persistencia y segun DAO usado crea un USERDTO para retornar a service.
    async createUser(createUserData){
        console.log('ggd:',createUserData)
        try{
            if (!(createUserData instanceof CreateUserDTO)) throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.createUser|','No se recibio una instancia valida para crear un usuario...')
                //Con los datos extraidos se hace el crud...
            const resultUser = await usersDAO.createUser({...createUserData,cartId:null})
            //Con lo recibido se genera el nuevo USERDTO
            console.log('EN repository: ',resultUser)
            

            return new UserDTO({
                userId: resultUser._id,
                email: resultUser.email,
                password: resultUser.password,
                firstName: resultUser.first_name,
                lastName: resultUser.last_name,
                age: resultUser.age,
                role: resultUser.role,
                cartId: resultUser.cartId
            })
                
        }catch(error){

        }
    }
}

/*
  async createUser(receivedUser){
        try{
            //receivedUser es una instancia de userDTO pero con los datos para la creacion
            //De acuerdo a la base de datos usada transforma el registro recibido en dto

            const newUser = await usersDAO.createUser(receivedUser)
            if(process.env.database='mongo'){
                console.log('EN repository: ',newUser)
                return new UserDTO(newUser._id,newUser.email,newUser.password,newUser.first_name,newUser.last_name,newUser.age,newUser.role,newUser.cart)
            }
        }catch(error){

        }
    }
}

*/