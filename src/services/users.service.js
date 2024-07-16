

import { UsersRepository } from "../repositories/users-repository.js";
import { generateJWT } from "../utils/jwt.js";
import { isValidPassword,createHash } from "../utils/hashbcryp.js";
import { UsersServiceError } from "./errors.service.js";
import { CartsService } from "./carts.service.js";
import { UserDTOERROR } from "./errors.service.js";
import { MailingService } from "./mailing.service.js";
import cryptoRandomString from "crypto-random-string";
import { calcularMinutosTranscurridos } from "../utils/helpers.js";

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

            //Provee de un avatar por default.
            await usersRepository.addUserDocument(email,'avatar','/img/avatars/defaultavatar.png')

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
                    //Al token vamos a poner solo algunas propiedades del UserDTO
                    const userToken = generateJWT({
                        userId:updatedUser.userId,
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        age: updatedUser.age,
                        role: updatedUser.role,
                        cartId: updatedUser.cartId,
                        score: updatedUser.score,
                        lastConnection: updatedUser.lastConnection,
                        avatar: updatedUser.avatar
                    })
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
            const fechaActual  = new Date()
            const elapsedTime = fechaActual.setMinutes(fechaActual.getMinutes() - 30)
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
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.deleteInactiveUsers|','Error interno del servidor...')
        }
    }


 

    async changeUserRole({userEmail,newRole}){
        try{
            const updatedUser = await usersRepository.setRole({userEmail:userEmail, newRole:newRole})
            //Ya que el repo le pide a la BD y si actualiza devuelve el DTO del user actualizado
            //Si hubiese error va directo por catch
            return updatedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.changeUserRole|','Error interno del servidor...')
        }
    }


    async deleteUserByEmail(userEmail){
        //Le pide a repository que borre el usuario
        //Dado que repository lanza error si el user no existe o no es borrado
        //Por consecuenta lanza error tambien
        try{
            const deletedUser = await usersRepository.deleteUser(userEmail)
            return deletedUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.deleteUserByEmail|','Error interno del servidor...')
        }
    }


    async createRecoveryCodeForUser(userEmail){
        //Crea un codigo de recuperacion y fecha de caducidad para el usuario que pretende recuperar su password
        //Le devuelve al endpoint un objeto que tiene el codigo que debe mandar y la fecha de caducidad.
        try{
            const newRecoveryCode = cryptoRandomString({ length: 6, type: 'numeric' });
            const fechaActual = new Date();
            
            //Le pedimos al repositorio que actualice en la BD el codigo y fecha d expiracion
            const updatedUser = await usersRepository.setRecoveryPasswordInfo({
                userEmail: userEmail,
                newRecoveryPasswordCode: newRecoveryCode,
                newRecoveryPasswordExpiration: new Date(fechaActual.getTime() + 60 * 60 * 1000)
            })

            //Le enviamos el mail con la informacion al usuario.
            await MailingService.sendMail(
                `Hola ${updatedUser.email}!! Ingresa a la seccion de recupero de contraseña y pone este codigo ${updatedUser.recoveryPasswordCode} para cambiar tu contraseña
                Tenes tiempo hasta ${updatedUser.recoveryPasswordExpiration}. Luego de esa hora, tu codigo caducara !`,
                updatedUser.email,
                'Recupero de password en E-Commerce...'
            )
            //Devolvemos el control al controller para que de el OK al cliente y le avise que a ese email se le envio la informacion para recuperar password.
            return {
                email: updatedUser.email,
                expiration: updatedUser.recoveryPasswordExpiration
            }
        
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.createRecoveryCode|','Error interno del servidor...')
        }
    }


    async resetPassword({userEmail,recoveryCode,newPassword}){
        //Va a buscar el userEmail y va a comparar el recoveryCode y la expiration vs la hora actual
        //Si todo eso esta OK va a cambiar el password y devolver el userDTo con el user actualizado.
        //Si algo salio mal va a devolver un error. Ejemplo no coincide recoveryCode o la hora esta caducada.
        try{

            const pepita = (searchedUser) =>{
                // Suponiendo que searcheduser.recoveryPasswordExpiration es una cadena de texto en formato ISO 8601
                const recoveryPasswordExpiration = new Date(searcheduser.recoveryPasswordExpiration);
                const ahora = new Date();

                // Calcular la diferencia en milisegundos
                const diferenciaEnMilisegundos = ahora.getTime() - recoveryPasswordExpiration.getTime();

                // Calcular los minutos transcurridos
                const minutosTranscurridos = Math.floor(diferenciaEnMilisegundos / (1000 * 60));

                console.log(`Minutos transcurridos desde ${recoveryPasswordExpiration} hasta ahora: ${minutosTranscurridos}`);
            }


            const searcheduser = await usersRepository.getUserByEmail(userEmail)
            console.log(searcheduser)
            pepita(searcheduser)
            console.log('La hora ahora es: ', new Date())


            //Tenemos el dto con la informacion del usuario.
           // console.log(`Minutos transcurridos Desde... ${searcheduser.recoveryPasswordExpiration}`,`hasta ${new Date()}  \n`,'Resultado: ', calcularMinutosTranscurridos(new Date(searcheduser.recoveryPasswordExpiration), new Date()))
            if (
                searcheduser.email == userEmail && 
                searcheduser.recoveryPasswordCode == recoveryCode
            ){
                //Estaria todo ok entonces updateo para quitar el codigo del user
                return 
            }
            else{
                //Si no coincide algo
                throw new UsersServiceError(UsersServiceError.WRONG_PASSWORD,'|UsersService.resetPassword|','Error al intentar la contraseña. El codigo expiro o es incorrecto..')
            }


            return
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersService.resetPassword|','Error interno del servidor...')
        }
    }



}
    


   
