import { UsersDAO } from "../dao/factory.js";
import { UsersServiceError } from "../services/errors.service.js";
import { UserDTOERROR } from "../services/errors.service.js";

const usersDAO = new UsersDAO()


export class UsersRepository{

     async createUserWithCart({email,firstName,lastName,age,role,cartId}){
        try{
            //Controlo parametros primero
            //Si todo Ok creo el usuario y obtengo el dto para devolver.
            const createdUser = await usersDAO.create({email:email,firstName:firstName,lastName:lastName,age:age,role:role,cartId:cartId})
            return createdUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.createUserWithCart|','Error interno del servidor...')
        }
    }


    async createUserWithoutCart({email,firstName,lastName,age,role,cartId}){
        try{
            //Controlo parametros primero
            //Si todo Ok creo el usuario y obtengo el dto para devolver.
            const createdUser = await usersDAO.create({email:email,firstName:firstName,lastName:lastName,age:age,role:role})
            return createdUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.createUserWithoutCart|','Error interno del servidor...')
        }
    }

    async getAllUsers(){
        //Toma el email recibido y lo valida que sea email valido.
        //si lo es, lo busca en la bd. si esta devuelve dto,sino error.
        try{
            //validar mail else therow error
            const allUsers = await usersDAO.get()
            //Como se que devuelve arrays pero me devuelve 1 elemento deveulvo ese dto obtenido en posicion cero..
            return allUsers
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getAllUsers|','Error interno del servidor...')
        }
    } 

    async getUserByEmail(email){
        //Toma el email recibido y lo valida que sea email valido.
        //si lo es, lo busca en la bd. si esta devuelve dto,sino error.
        try{
            //validar mail else therow error
            const searchedUser = await usersDAO.get({userEmail:email})
            //Como se que devuelve arrays pero me devuelve 1 elemento deveulvo ese dto obtenido en posicion cero..
            return searchedUser[0]
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserByEmail|','Error interno del servidor...')
        }
    }

    async getUserByCart(cartId){
        //Toma el email recibido y lo valida que sea email valido.
        //si lo es, lo busca en la bd. si esta devuelve dto,sino error.
        try{
            const searchedUser = await usersDAO.get({userCartId:cartId})
            //Como se que devuelve arrays pero me devuelve 1 elemento deveulvo ese dto obtenido en posicion cero..
            return searchedUser[0]
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserByCart|','Error interno del servidor...')
        }
    }

    //Para esta uso este metodo exclusivo para no tener problemas a futuro xq mongo toma _id y sequelize no usare _id sino id
    async getUserById(userId){
        //Toma el email recibido y lo valida que sea email valido.
        //si lo es, lo busca en la bd. si esta devuelve dto,sino error.
        try{
            const searchedUser = await usersDAO.get({userId:userId})
            //Como se que devuelve arrays pero me devuelve 1 elemento deveulvo ese dto obtenido en posicion cero..
            return searchedUser[0]
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserById|','Error interno del servidor...')
        }
    }


    async setLastConnection(userEmail,newLastConnection){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObjecto:{
                    lastConnection:newLastConnection
                }})
            return updatedUser //Se deveulve el dto con el lastConnection modificado
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setLastConnection|','Error interno del servidor...')
        }
    
    }

    async setPassword(userEmail,newPassword){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    password:newPassword
                }})
            return updatedUser //Se deveulve el dto con el password modificado
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setPassword|','Error interno del servidor...')
        }
    
    }

    async setRole(userEmail,newRole){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                role:newRole
                }})
            return updatedUser //Se deveulve el dto con el role modificado
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setRole|','Error interno del servidor...')
        }
    
    }

    //La usaremos para los users que inician sesion y vinciular a su carro de local storage
    async setCart(userEmail,newCartId){
        //Recibe el email del user y lo valida para buscarlo en la capa de persistencia.
        //Recibe de la capa de persistencia un userDTO, le setea lo requerido y le pide a la capa de persistencia el update.
        //La capa de persistencia le envia el userDTO del registro modificado y esta capa lo envia a la capa service.
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    cartId:newCartId
                }})
            return updatedUser //Se deveulve el dto con cartId Modificado
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setCart|','Error interno del servidor...')
        }
    
    }



     async userSetEnabled(userEmail,newState){
        try{
            //Busca el usuario y recibe un DTO, si no hubiese usuario va a error por la implementacion de la capa de persistencia.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    enabled:newState //Obvio sera true o false.
                }})
            return updatedUser //Se deveulve el dto con cartId Modificado
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.userSetEnabled|','Error interno del servidor...')
        }
    
    }

    
    async setRecoveryPasswordInfo(userEmail,newRecoveryPasswordCode,newRecoveryPasswordExpiration){
        try{
      
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    recoveryPasswordCode: newRecoveryPasswordCode,
                    recoveryPasswordExpiration: newRecoveryPasswordExpiration
                }})
            return updatedUser 
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setRecoveryPasswordInfo|','Error interno del servidor...')
        }
    
    }

    async setUserProfileInfo({userEmail,firstName,lastName,age}){
        try{
      
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    firstName : firstName,
                    lastName: lastName,
                    age: age
                }})
            return updatedUser 
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setUserProfileInfo|','Error interno del servidor...')
        }
    
    }

    async addUserDocument(userEmail,newDocName,newDocReference){
    
        try{
            //Se busca el user en la base de datos y se mira su lista de documentos. Se le agrega el nuevo y se hace el update
            const searchedUser = await this.getUserByEmail(userEmail)
            //if user no existe lanzo error
            //Leo desde el dto la lista de documentos actual y le agrego el documento.
            const currentDocsList = searchedUser.documents
            currentDocsList.push({docName:newDocName,docReference:newDocReference})
            //Ahora inserto la lista ya actualizada y devuelvo el dto actualizado.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    documents: currentDocsList
                }})
            return updatedUser //Se deveulve el dto con cartId Modificado
        
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.addUserDocument|','Error interno del servidor...')
        }
    
    }

    async deleteUserDocument(userEmail,docNameForDelete){
    
        try{
            //Se busca el user en la base de datos y se mira su lista de documentos. Se le agrega el nuevo y se hace el update
            const searchedUser = await this.getUserByEmail(userEmail)
            //if user no existe lanzo error
            //Leo desde el dto la lista de documentos actual y le agrego el documento.
            const currentDocsList = searchedUser.documents
            //Busco si existe el docName que tenga el nombre pedido
            const docPosition = currentDocsList.findIndex(item => item.docName == docNameForDelete)
            if (docPosition >=0 ) currentDocsList.splice(position,1)
            else throw new UsersServiceError(UsersServiceError.UPDATING_ERROR,'|UsersRepository.deleteUserDocument|','No existe el documento que se intenta eliminar...')
       
            //Ahora inserto la lista ya actualizada y devuelvo el dto actualizado.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    documents: currentDocsList
                }})
            return updatedUser //Se deveulve el dto con cartId Modificado
        
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.deleteUserDocument|','Error interno del servidor...')
        }
    
    }


    async updateUserDocument(userEmail,docNameForUpdate,newDocReference){
    
        try{
            //Se busca el user en la base de datos y se mira su lista de documentos. Se le agrega el nuevo y se hace el update
            const searchedUser = await this.getUserByEmail(userEmail)
            //if user no existe lanzo error
            //Leo desde el dto la lista de documentos actual y le agrego el documento.
            const currentDocsList = searchedUser.documents
            //Busco si existe el docName que tenga el nombre pedido
            const docPosition = currentDocsList.findIndex(item => item.docName == docNameForUpdate)
            if (docPosition >=0 ) currentDocsList[position,1] = {docName: docNameForUpdate, docReference: newDocReference}
            else throw new UsersServiceError(UsersServiceError.UPDATING_ERROR,'|UsersRepository.updateUserDocument|','No existe el documento que se intenta modificar...')
       
            //Ahora inserto la lista ya actualizada y devuelvo el dto actualizado.
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    documents: currentDocsList
                }})
            return updatedUser
        
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.updateUserDocument|','Error interno del servidor...')
        }

        

    }

    async deleteUsersList(usersListForDelete){
        try{
            //Ya que la idea es mostrar los datos delos borrados primero los guardo
            //Pido todos los users al DAO, los que estan en  lista los guardo en otra lista
            //mando a borrar
            //si salio todo ok y coincide todo envio los resultados
            const deleteResults = await usersDAO.delete(usersListForDelete)

        }catch(error){

        }
    }
    

}

    //-----------------------------------NUEVOS METODOS:

    // createUserWithCart
    // createUserWithoutCart
    //get by email
    //get byID
    //update password
    //updaterole
    //updatelastConnection
    //disabledUser
    //enabledUser
    //Ad doc,updateDoc
    //updaterecoveryInfo(para password y expiration)
    //updateUserProfile (firstname,lastname,age)
    //updateUserCreateBeforeDate
