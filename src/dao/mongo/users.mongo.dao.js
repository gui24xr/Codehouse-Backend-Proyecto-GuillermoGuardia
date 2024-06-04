import { UserModel } from "../../models/user.models.js";
import { UsersServiceError } from "../../services/errors.service.js";
import { UserDTO } from "../../dto/users.dto.js";

//Importar errores


export default class UsersMongoDao{

    //recibe un objeto con los campos necesarios para la creacion de usuario
    //Este objeto debe provenir del metodo 'prepareUserObject' de la clase USerDTO
    //Viene entero porque ya esta validado y preparado para no meter roles inexistentes
    //Crea el usuario y lo devuelve en un user DTO
    //El carro se lo asigna la capa servicios xq talvez podriamos tener users sinn cart a futuro
    //El usuario se crea sin cart, luego la capa de servicios le asignara un cart y updateal registro
    async createUser(receivedUser){
        //Ingresa un DTO y devuelve el registro de mongo.
        //Que tengan carros los useer es parte de la logica de negocio
        try{
        const {email,password,first_name,last_name,userRole,age,cartId} = receivedUser
        console.log('User recibido en DAO: ',receivedUser)
        const existUser = await UserModel.findOne({email:email})
        //Existe usuario no creo nada y salgo.
        if (existUser) throw new UsersServiceError(UsersServiceError.USER_EXIST_IN_DATABASE,'|UsersMongoDao.createUser|')
        //Si el user no existe prpcedo a crearlo.
        const newUser = new UserModel({
            email:email,
            password:password,
            first_name:first_name,
            last_name: last_name,
            age: age,
            role:userRole,
            cart: cartId
        })
        await newUser.save()
        return newUser
        
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.createUser|')
        }
    }


    async getUserById(userId){
        try{
            const searchedUser = await UserModel.findOne({id:userId}).populate('cart')
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.getUserById|')
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getUserById|')
        }
    }

    async getUserByEmail(email){
        try{
            const searchedUser = await UserModel.findOne({email:email}).populate('cart')
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.getUserByEmail|')
            return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getUserByEmail|')
        }
    }

    //En este caso receivedUser debe ser un dto. La idea es que todaslas capaz trabajen y se pasen el dto
    async updateUser(receivedUser){
        //Si no me dio un cartDTO salgo
        try{
            if (!(receivedUser instanceof UserDTO)) throw new UsersServiceError(UsersServiceError.UPDATING_ERROR,'|UsersMongoDao.updateUser|')
                //Leo cartDTO y actuo . Primero busco el user
                const searchedUser = await UserModel.findOne({id:receivedUser.userId})
                if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.updateUser|')
                //Si el user existe trabajo sobre el mismo y luego luego lo guardo.
                searchedUser.email = receivedUser.email;
                searchedUser.password = receivedUser.password;
                searchedUser.first_name = receivedUser.first_name;
                searchedUser.last_name = receivedUser.last_name;
                searchedUser.age = receivedUser.age;
                searchedUser.userRole = receivedUser.userRole;
                searchedUser.cart = receivedUser.cart;
    
                // Guardar los cambios en la base de datos
                await searchedUser.save()
                return searchedUser
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.updateUser|')
        }
    }

    //Borrar usuario. Si no existe devuelve error xq no sepuede borrar lo que no existe
    //Recibe user DTO
    async deleteUser(receivedUser){
        try{
            if (!(receivedUser instanceof UserDTO)) throw new UsersServiceError(UsersServiceError.DELETING_ERROR,'|UsersMongoDao.deleteUser|')
            const deleteResult = await UserModel.deleteOne({ email:receivedUser.email })
            if (deleteResult.deletedCount === 0) {
                throw new UsersServiceError(UsersServiceError.USER_NO_EXIST, '|UsersMongoDao.deleteUser|');
            }
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.deleteUser|')
        }
    }
       
}