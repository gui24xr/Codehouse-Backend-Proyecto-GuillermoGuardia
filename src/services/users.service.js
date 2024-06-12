import { CreateUserDTO, UserDTO } from "../dto/user-dto/user.dto.js";

import { UsersRepository } from "../repositories/users-repository.js";
import { generateJWT } from "../utils/jwt.js";
import { isValidPassword,createHash } from "../utils/hashbcryp.js";
import { UsersServiceError } from "./errors.service.js";
import { CartsService } from "./carts.service.js";
import { UserDTOERROR } from "./errors.service.js";


const usersRepository = new UsersRepository()

export class UsersService{

   async createUser(firstName, lastName, email, password,age, role){
        try{
            //Se validan los datos y se controla la entrada de campos
            //Esta validacion tmb se hace en la capa controllers pero aca se repite xq este servicio puede ser usado por otras capas.
            //Entre esta validaciones se debe revisar que cumpla las reglas de contraseñas en nuestra app.
            //Se crea un carro para el nuevo user y extrae el id del carro creado para asociar.
            const cartsService = new CartsService()
            const cart = await cartsService.createCart()
            const {id:cartId} = cart
            //Se crea instancia de createUserDto
            console.log('Tipo de eddad. ',typeof(age))
            const dataForNewUser = new CreateUserDTO({
                email:email,
                password:createHash(password),
                firstName:firstName,
                lastName:lastName,
                age:Number(age),
                role:role
            })
            
            //Pido a repository la creacion de un usurio cond ataForNewUser y un cartId
            const newUser = await usersRepository.createUserWithCart(dataForNewUser,cartId)
            console.log('New user: ', newUser)
            return newUser   //Devuelvo el user creado.
          } catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.createUser|','Error interno del servidor...')
        }
    }

    
    //Le pide a repository el user, repository si existe el user se lo devuelve, y si no error.
    //
    //Si va todo bien y el user existe genera un token con los datos del user para enviarle a la capa controllers
    //Devuelve el token generado y una instancia del user en formato UserDTo
    async authenticateUser(email,password){
        try{
            //Se validan la cantidad de parametros y datos, en este caso password no necesario validar.
            //Le pido a la capa repository el usuario.
            const searchedUser = await usersRepository.getUserByEmail(email)
            //Repository me devuelve dto y miro que coincida la contraseña.
            if (searchedUser) {
                if (isValidPassword(password,searchedUser.password)) {
                    //Se crea el jsonwebtockn que se retornara ala capa controllers
                    
                    const updatedUser = await usersRepository.updateLastConnection(searchedUser.userId,new Date())
                    const userToken = generateJWT(updatedUser)
                
                    return {userData: searchedUser, userToken:userToken}
                } 
                else throw new UsersServiceError(UsersServiceError.WRONG_PASSWORD,'|UsersService.authenticateUser|','El usuario y/la contraseña no coinciden...')
            }
           //En este caso si no hay user se va directo a error.
        }
        catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.authenticateUser|','Error interno del servidor...')
        }
    }

    async changeUserRole(userId,newRole){
        //Recibe los datos de repository y los valida.
        //Pide el usuario, lo modifica y se lo envia a repository para que le pida a persistencia que lo grabe
        //Devuelve el user con el rol modificado o error segun corresponda.
        //Dado que nuestros user DTO deben cumplir reglas
        try{
            const updatedUser = await usersRepository.setRole(userId,newRole)
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.changeUserRole|','Error interno del servidor...')
        }
    }

    async logout(userId){
        //Setea last connection del user y devuelve el user actualizado.
        try{
            const updatedUser = await usersRepository.updateLastConnection(userId,new Date())
            console.log('En service: ',updatedUser)
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.logout|','Error interno del servidor...')
        }
    }

    async getUserByEmail(email){
        //Se valida que sea un email (hacerlo)
        try{
            const searchedUser = await usersRepository.getUserByEmail(email)
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.getUserByEmail|','Error interno del servidor...')
        }
    }

    async getUserByCart(cartId){
        //Se valida que sea un email (hacerlo)
        try{
            const searchedUser = await usersRepository.getUserByCart(cartId)
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.getUserByEmail|','Error interno del servidor...')
        }
    }


   
}