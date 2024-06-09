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
   
}