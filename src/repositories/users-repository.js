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
        //Recibe createUserDtoInstance y un cartId del carro creado para asignar al user.
        //Valida que se trate de un createUserDTO, de lo contrario devuelve error.
        //Deconstructura el user y pide el create a la capa de persistencia para recibir un DTO con el user creado.
        //Devuelve el userDTO recibido de la capa de persistencia para enviarselo a la capa service.
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
            //validar mail else therow error
            const searchedUser = await usersDAO.getUserByFilter('email',email)
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserByEmail|','Error interno del servidor...')
        }
    }

    async getUserByCart(cartId){
        //Toma el email recibido y lo valida que sea email valido.
        //si lo es, lo busca en la bd. si esta devuelve dto,sino error.
        try{
            //validar mail else therow error
            const searchedUser = await usersDAO.getUserByFilter('cart',cartId)
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserByCart|','Error interno del servidor...')
        }
    }

    //Para esta uso este metodo exclusivo para no tener problemas a futuro xq mongo toma _id y sequelize no usare _id sino id
    async getUserById(userId){
        //Toma el email recibido y lo valida que sea email valido.
        //si lo es, lo busca en la bd. si esta devuelve dto,sino error.
        try{
            //validar mail else therow error
            const searchedUser = await usersDAO.getUserById(userId)
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserByEmail|','Error interno del servidor...')
        }
    }


    async updateUser(user){
        //Recibe un userDTO y le pide a la capa perssitencia que updatee el registro entero.
        try{
            if (!(user instanceof UserDTO)) throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.updateUser|','No se recibio una instancia valida editar un usuario en la base de datos...')
            const updatedUser = await usersDAO.updateUser(user)
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.updateUser|','Error interno del servidor...')
        }
    }


    async updateLastConnection(userId,newLastConnection){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const searchedUser = await usersDAO.getUserById(userId)
            searchedUser.setLastConnection(newLastConnection)
            const updateResult = await this.updateUser(searchedUser)
            return updateResult
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.updateLastConnection|','Error interno del servidor...')
        }
    
    }

    async setPassword(userId,newPassword){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const searchedUser = await usersDAO.getUserById(userId)
            searchedUser.setPassword(newPassword)
            const updateResult = await this.updateUser(searchedUser)
            return updateResult
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setPassword|','Error interno del servidor...')
        }
    
    }

    async setRole(userId,newRole){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const searchedUser = await usersDAO.getUserById(userId)
            searchedUser.setRole(newRole)
            const updateResult = await this.updateUser(searchedUser)
            return updateResult
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setRole|','Error interno del servidor...')
        }
    
    }

    //La usaremos para los users que inician sesion y vinciular a su carro de local storage
    async setCart(userId,newCart){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const searchedUser = await usersDAO.getUserById(userId)
            searchedUser.setCart(newCart)
            const updateResult = await this.updateUser(searchedUser)
            return updateResult
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setCart|','Error interno del servidor...')
        }
    
    }

    async addDocument(userId,docName,docRef){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const searchedUser = await usersDAO.getUserById(userId)
            searchedUser.addDocument(docName,docRef)
            const updateResult = await this.updateUser(searchedUser)
            return updateResult
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.addDocument|','Error interno del servidor...')
        }
    
    }



}

