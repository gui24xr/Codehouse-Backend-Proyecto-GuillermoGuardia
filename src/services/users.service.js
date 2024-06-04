import { UserDTO } from "../dto/users.dto.js";
import { UsersRepository } from "../repositories/users-repository.js";
import { isValidPassword,createHash } from "../utils/hashbcryp.js";
import { UsersServiceError } from "./errors.service.js";
import { CartsService } from "./carts.service.js";

const usersRepository = new UsersRepository()

export class UsersService{

    //Registra nuevo usuario
    async createUserWithCart(first_name, last_name, email, password,age, role){
        try{
            //Arma un objeto prepare para enviar al repository
            //Pero el password ya tiene que ir hasheado
            const cartsService = new CartsService()
            const cartForNewUser = await cartsService.createCart()
            console.log('Carro para el nuevo user: ',cartForNewUser)
            const newUserData = new UserDTO(null,email,createHash(password),first_name,last_name,age,role,cartForNewUser.id)
            //Com este objeto manda a crear el usuario y recibe  un userDO
            const newUser = await  usersRepository.createUser(newUserData)
            console.log('Hemos creado: ', newUser)
            
            return newUser
            //Como los usuarios no se crean con carro, debe updatearlo para ponerle el carro.
        }catch(error){

        }
    }/*
    async createUserWithoutCart(first_name, last_name, email, password,age, role){
        try{
            //Arma un objeto prepare para enviar al repository
            //Pero el password ya tiene que ir hasheado
            const newUserData = UserDTO.prepareUserObject(email,createHash(password),first_name,last_name,role,age)
            //Com este objeto manda a crear el usuario y recibe  un userDO
            const newUser = await  usersRepository.createUser(newUserData)
            //Como los usuarios no se crean con carro, debe updatearlo para ponerle el carro.
        }catch(error){

        }
    }

    //hace el login y devuelve a la capa ccontrollers para que la misma envie el token
    async authenticateUser(){
        try{

        }catch(error){

        }
    }

    //hace modificaciones sobre el user sea rol,carro, etc
    //Se modifica el objeto dto y se envia al repository
    async updateUser(){
        try{

        }catch(error){

        }
    }

*/
   
}