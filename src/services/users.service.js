import { CreateUserDTO, UserDTO } from "../dto/user-dto/user.dto.js";

import { UsersRepository } from "../repositories/users-repository.js";
import { isValidPassword,createHash } from "../utils/hashbcryp.js";
import { UsersServiceError } from "./errors.service.js";
import { CartsService } from "./carts.service.js";


const usersRepository = new UsersRepository()

export class UsersService{

    //En nuestra app y al menos por ahora todos los usuarios tienen cart por eso uso esta funcion para la creacion.
    async createUserWithCart(firstName, lastName, email, password,age, role){
        
        try{
          //Creo una instancia de CreateUserDTO, nada que validar xq se encarga de eso el USERDTO
          const dataForNewUser = new CreateUserDTO({email:email,password:password,firstName:firstName,lastName:lastName,age:age,role:role})
          console.log('data: ', dataForNewUser)
          const newUser = await usersRepository.createUser(dataForNewUser)
          console.log('new userr: ', newUser)
          return newUser
        }catch(error){
            //cachear los errores si no se creo x algun motivo
        }
    }

    async createUser(firstName, lastName, email, password,age, role){
        try{
            //Se crea un carro para el nuevo user
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
            //Pido a repository la creacion
            const newUser = await usersRepository.createUserWithCart(dataForNewUser,cartId)

            console.log('User creado: ',newUser)
            return newUser
          
        }catch(error){
            //cachear los errores si no se creo x algun motivo
        }
    }

    
    //Comprueba si existen mail y contraseña y coinciden
    async authenticateUser(email,password){
       console.log('En service: ', email,password)
        try{
            const searchedUser = await usersRepository.getUserByEmail(email)
            //Repository me devuelve dto
            console.log(searchedUser)
            if (searchedUser) {
                if (isValidPassword(password,searchedUser.password))  return searchedUser
                else throw new UsersServiceError(UsersServiceError.AUTH_ERROR,'Error de autenticacion: Password Incorrecto !!!')
            }
            else{//No existe user con dicho email.
                throw new UsersServiceError(UsersServiceError.AUTH_ERROR,`Error de autenticacion: No existe el usuario con email ${email}.`)
            }
        }
        catch(error){
            //if (error instanceof UsersServiceError) throw error
            //else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersRepository.authenticateUser||...')
        }
    }

   
}