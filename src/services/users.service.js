

import { UsersRepository } from "../repositories/users-repository.js";
import { generateJWT } from "../utils/jwt.js";
import { isValidPassword,createHash } from "../utils/hashbcryp.js";
import { UsersServiceError } from "./errors.service.js";
import { CartsService } from "./carts.service.js";
import { UserDTOERROR } from "./errors.service.js";
import { MailingService } from "./mailing.service.js";


const usersRepository = new UsersRepository()

export class UsersService{

   async createUser({email, password, role, firstName, lastName, age}){
        try{
            const cartsService = new CartsService()
            const cartForNewUser = await cartsService.createCart()
            const {cartId} = cartForNewUser
            //Se crea instancia de createUserDto
            const newUser = await usersRepository.createUserWithCart({
                email: email,
                password: createHash(password),
                firstName: firstName,
                lastName:lastName,
                age: age,
                role:role,
                cartId: cartId
            })

            return newUser
   
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
                console.log('Searcheduser: ',searchedUser)
                if (isValidPassword(password,searchedUser.password)) {
                    //Se crea el jsonwebtockn que se retornara a la capa controllers
                    const updatedUser = await usersRepository.setLastConnection(email,new Date())
                    const userToken = generateJWT(updatedUser)
                    return {
                        userData: updatedUser, 
                        userToken: userToken
                    }
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
            const updatedUser = await usersRepository.setRole(email,newRole)
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.changeUserRole|','Error interno del servidor...')
        }
    }

    async logout(userId){
        //Setea last connection del user y devuelve el user actualizado.
        try{
            //Busco el email de este userID
            const searchedUser = await usersRepository.getUserById(userId)
            const updatedUser = await usersRepository.setLastConnection(searchedUser.email,new Date())
            console.log('En service: ',updatedUser)
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.logout|','Error interno del servidor...')
        }
    }

    async getAllUsers(){
        try{
            const usersList = await usersRepository.getAllUsers()
            return usersList
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.getAllUsers|','Error interno del servidor...')
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


    async deleteInactiveUsers(){
        //Borra todos los users inactivos 30 minutos antes de la hora actual.
        //Les envia un email dando aviso que su cuenta fue borrada por inacividad.
        try{
            //Obtengo la fecha actual y la fecha de hace 15 minutos.
            const thisMoment  = new Date()
            const inactivityHours = process.env.INACTIVITY_TIME_USERS_TO_DELETE || 1.5 //Para 15 mins
            let elapsedTime = new Date(thisMoment - (60 * 60 * 1000) * inactivityHours)
            console.log(elapsedTime)
            //Pido a repositorio que borre los usuarios inactivos y me devolvera la lista de UserDTo borrados.
           const deleteInactiveUsersResult = await usersRepository.deleteByLastConnectionBefore(elapsedTime)
            //Pero como necesito enviar mails y mostrar los borrados mapeo para obtetener la lista de mails.
            const deletedUsersMailsList = deleteInactiveUsersResult.map(item => (item.email))
            //SI hubo users eliminados le pido al servicio de email que les de aviso.
            if (deleteInactiveUsersResult.length > 0){
                //Pido al servicio de email que mande mails dando aviso a cada una de las cuentas eliminadas...
                deletedUsersMailsList.forEach( item => {
                    MailingService.sendMail(`${item} tu cuenta ah sido suspendida por inactividad !!...`,item,'Cuenta suspendida.')
                })
                //devuelvo la lista de mails de users borrados al controller.
                return deletedUsersMailsList
            }else{
                //si no se borraron users devuevlvo array vacio.
                return [] 
            }

        
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.getUserByEmail|','Error interno del servidor...')
        }
    }


    async recoveryPassword(){

    }

    async changeUserRole(){
        try{

        }catch(error){

        }
    }

    async deleteUserByEmail(){
        try{

        }catch(error){
            
        }
    }





}
    


   
