import { UsersDAO } from "../dao/factory.js";
import { UsersServiceError } from "../services/errors.service.js";
import { CreateUserDTO, UserDTO } from "../dto/user-dto/user.dto.js";
import { UserDTOERROR } from "../services/errors.service.js";

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

     async createUserWithCart(newUserData,cartId){
        //Recibe createUserDtoInstance
        //Recibe cart ID
        //Deconstructura el user y pide el create
        //Recibe un user DTO de la BD
        //Lo devulve a service
        try{
            if (!(newUserData instanceof CreateUserDTO)) throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.createUserWithCart|','No se recibio una instancia valida para crear un usuario...')
                const newUser = await usersDAO.createUser(
                   newUserData.email,
                   newUserData.password,
                   newUserData.firstName,
                   newUserData.lastName,
                   newUserData.role,
                   newUserData.age,
                   cartId
               )
            console.log('En repository user creado: ', newUser)
            return newUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.createUserWithCart|','Error interno del servidor...')
        }
    }


    async getUserByEmail(email){
        //Toma el email recibido y lo valida que sea email valido.
        //si lo es, lo busca en la bd. si esta devuelve dto,sino error.
        try{
            console.log('Repo Desde service: ', email)
            //validar mail else therow error
            const searchedUser = await usersDAO.getUserByEmail(email)
            console.log('Repo desde persistencia: ', searchedUser)
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserByEmail|','Error interno del servidor...')
        }
    }

    async updateUser(user){
        console.log('Recibi para update: ', user)
        try{
            if (!(user instanceof UserDTO)) throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.updateUser|','No se recibio una instancia valida editar un usuario en la base de datos...')
            const updatedUser = await usersDAO.updateUser(user)
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.updateUser|','Error interno del servidor...')
        }
    }


}

