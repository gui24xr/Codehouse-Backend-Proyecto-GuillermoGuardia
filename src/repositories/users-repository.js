import { UsersDAO } from "../dao/factory.js";
import { UsersServiceError } from "../services/errors.service.js";
import { UserDTO } from "../dto/users.dto.js";

const usersDAO = new UsersDAO()

export class UsersRepository{
    async createUser(receivedUser){
        try{
            //receivedUser es una instancia de userDTO pero con los datos para la creacion
            //De acuerdo a la base de datos usada transforma el registro recibido en dto

            const newUser = await usersDAO.createUser(receivedUser)
            if(process.env.database='mongo'){
                return new UserDTO(newUser._id,newUser.email,newUser.password,newUser.first_name,newUser.last_name,newUser.age,newUser.role,newUser.cart)
            }
        }catch(error){

        }
    }
}