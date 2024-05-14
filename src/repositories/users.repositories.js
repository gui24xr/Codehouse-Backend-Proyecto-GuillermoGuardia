
import { UserModel } from "../models/user.models.js";
import { CartRepository } from "./cart.repositories.js";
import { isValidPassword } from "../utils/hashbcryp.js";
import { UsersServiceError, InternalServerError } from "../services/errors/custom-errors.js";

const cartsRepository = new CartRepository()

export class UsersRepository{
    async createUser(user){
        //console.log('LLego:',user)
       try{
            const existUser = await UserModel.findOne({email:user.email})
            if (existUser) throw new UsersServiceError(UsersServiceError.REGISTER_ERROR,`El usuario ${user.email} ya existe en nuestra base de datos !!`)
            else  {
                //Creo un carro para el user.
                const cartForNewUser = await cartsRepository.createCart()
                const newUser = new UserModel({...user,cart:cartForNewUser})
                await newUser.save()
                return newUser
            }
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersRepository.createUser||...')
        }
    }





    //Comprueba si existen mail y contraseña y coinciden
    async authenticateUser(email,password){
        try{
            const searchedUser = await UserModel.findOne({email:email})
            if (searchedUser) {
                if (isValidPassword(password,searchedUser.password))  return searchedUser
                else throw new UsersServiceError(UsersServiceError.AUTH_ERROR,'Error de autenticacion: Password Incorrecto !!!')
            }
            else{//No existe user con dicho email.
                throw new UsersServiceError(UsersServiceError.AUTH_ERROR,`Error de autenticacion: No existe el usuario con email ${email}.`)
            }
        }
        catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersRepository.authenticateUser||...')
        }
    }



    async getUser(email){
        //Si existe el user lo devuelve, de lo contrario devuelve null
        try {
            const searchedUser = await UserModel.findOne({email:email})
            if (searchedUser) {
                //console.log(`Existe user con email ${email}`)
                return searchedUser            }
            else {
                console.log(`No existe user con email ${email}`)
                return null
            }
        } catch (error) {
            throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersRepository.getUser||...')
        }
    }


    //Esta funcion devolvera los usuarios con coincidencias en esos campos
    //FilterObject debe ser un objeto que tenga prop campo, valor valor, y puede ser mas de uno...
    async getUsers(filterObject){
         try {//console.log('Filter: ', filterObject)
            const matches = await UserModel.find(filterObject)
            return matches
        } catch (error) {
            throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersRepository.getUsers||...')
        }
        
    }

    async getMailRole(email){   
    //Revisara si existe un user con ese email y devolvera el role (user o admin)
    //de no estar registrado devuelve null
        try {
            const searchedUser = await this.getUser(email)
            if (searchedUser) {//console.log(`Existe user con email ${email}`)
                return searchedUser.role            }
            else {//console.log(`No existe user con email ${email}`)
                return null
            }
        } catch (error) {
            throw new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersRepository.getMailRole||...')
        }
    }
    
}