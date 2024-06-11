import { CreateUserDTO, UserDTO } from "../dto/user-dto/user.dto.js";

import { UsersRepository } from "../repositories/users-repository.js";
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
            const dataForNewUser = new CreateUserDTO({
                email:email,
                password:createHash(password),
                firstName:firstName,
                lastName:lastName,
                age:age,
                role:role
            })
            //Pido a repository la creacion de un usurio cond ataForNewUser y un cartId
            const newUser = await usersRepository.createUserWithCart(dataForNewUser,cartId)
            return newUser   //Devuelvo el user creado.
          } catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.createUser|','Error interno del servidor...')
        }
    }

    
    //Comprueba si existen mail y contraseña y coinciden
    async authenticateUser(email,password){
       console.log('En service: ', email,password)
        try{
            //Se validan la cantidad de parametros y datos, en este caso password no necesario validar.
            //Le pido a la capa repository el usuario.
            const searchedUser = await usersRepository.getUserByEmail(email)
            //Repository me devuelve dto y miro que coincida la contraseña.
            console.log(searchedUser)
            if (searchedUser) {
                if (isValidPassword(password,searchedUser.password))  return searchedUser
                else throw new UsersServiceError(UsersServiceError.WRONG_PASSWORD,'|UsersService.authenticateUser|','El usuario y/la contraseña no coinciden...')
            }
           //En este caso si no hay user se va directo a error.
        }
        catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.authenticateUser|','Error interno del servidor...')
        }
    }

    async changeUserRole(email,newRole){
        //Recibe los datos de repository y los valida.
        //Pide el usuario, lo modifica y se lo envia a repository para que le pida a persistencia que lo grabe
        //Devuelve el user con el rol modificado o error segun corresponda.
        //Dado que nuestros user DTO deben cumplir reglas
        try{
            const userForUpdated = await usersRepository.getUserByEmail(email)
            console.log('Para updatear: ', userForUpdated)
            //Se recibio user DTO, se lo modifica
            userForUpdated.setRole(newRole)
            //Se lo envia a repository
            const updatedUser = usersRepository.updateUser(userForUpdated)
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.changeUserRole|','Error interno del servidor...')
        }
    }

   
}