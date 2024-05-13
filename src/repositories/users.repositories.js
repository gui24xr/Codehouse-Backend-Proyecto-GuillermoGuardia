
import { UserModel } from "../models/user.models.js";
import { CartRepository } from "./cart.repositories.js";
import { isValidPassword } from "../utils/hashbcryp.js";
import { usersServiceError, AuthServiceError } from "../services/errors/custom-errors.js";

const cartsRepository = new CartRepository()

export class UsersRepository{
    async createUser(user){
        //console.log('LLego:',user)
       try{
            const existUser = await UserModel.findOne({email:user.email})
            if (existUser) throw new usersServiceError(`El usuario ${user.email} ya existe en nuestra base de datos !!`)
            else  {
                //Creo un carro para el user.
                const cartForNewUser = await cartsRepository.createCart()
                const newUser = new UserModel({...user,cart:cartForNewUser})
                await newUser.save()
                return newUser
            }
        }catch(error){
            throw error
        }
    }





    //Comprueba si existen mail y contraseña y coinciden
    async authenticateUser(email,password){
        try{
            const searchedUser = await UserModel.findOne({email:email})
            if (searchedUser) {
                if (isValidPassword(password,searchedUser.password))  return searchedUser
                else throw new AuthServiceError('Error de autenticacion: Password Incorrecto !!!')
            }
            else{//No existe user con dicho email.
                throw new AuthServiceError(`Error de autenticacion: No existe el usuario con email ${email}.`)
            }
        }
        catch(error){
            throw error //lanzo el error a la funcion que la llamo
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
            throw new Error(`Error al intentar comprobar existencia de usuario...`)
        }
    }


    //Esta funcion devolvera los usuarios con coincidencias en esos campos
    //FilterObject debe ser un objeto que tenga prop campo, valor valor, y puede ser mas de uno...
    async getUsers(filterObject){
        //console.log('Filter: ', filterObject)
        try {
            const matches = await UserModel.find(filterObject)
            return matches
            } catch (error) {
            throw new Error(`Error al intentar comprobar existencia de usuario...`)
        }
        
    }


    async getMailRole(email){
        
    //Revisara si existe un user con ese email y devolvera el role (user o admin)
    //de no estar registrado devuelve null
        try {
            const searchedUser = await this.getUser(email)
            if (searchedUser) {
                console.log(`Existe user con email ${email}`)
                return searchedUser.role            }
            else {
                console.log(`No existe user con email ${email}`)
                return null
            }
        } catch (error) {
            throw new Error(`Error al intentar comprobar existencia de usuario...`)
        }
    }
    
}