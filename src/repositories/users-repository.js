import { UsersDAO } from "../dao/factory.js";
import { UsersServiceError } from "../services/errors.service.js";
import { UserDTOERROR } from "../services/errors.service.js";

const usersDAO = new UsersDAO()


export class UsersRepository{

     async createUserWithCart({email,password,firstName,lastName,age,role,cartId}){
        //Crea un usuario con cart.
        //Validar que vengan los parametros correctos, si no, error
        try{
            //Controlo parametros primero
            //Si todo Ok creo el usuario y obtengo el dto para devolver.
            const createdUser = await usersDAO.create({email:email,password:password, firstName:firstName,lastName:lastName,age:age,role:role,cartId:cartId})
            return createdUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.createUserWithCart|','Error interno del servidor...')
        }
    }


    async createUserWithoutCart({email,password,firstName,lastName,age,role}){
        try{
            //Crea un usuario sin cart.
              //Validar que vengan los parametros correctos, si no, error
            const createdUser = await usersDAO.create({email:email, password:password,firstName:firstName,lastName:lastName,age:age,role:role})
            return createdUser
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.createUserWithoutCart|','Error interno del servidor...')
        }
    }

    async getAllUsers(){
        /*Devuelve un array de UserDTO con todos los usuarios de la BD*/
        try{
            const allUsers = await usersDAO.get()
            return allUsers
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getAllUsers|','Error interno del servidor...')
        }
    } 

    async getUserByEmail(email){
        /*Busca en la BD un usuario por su email y lo devuelve, si no existe, devuelve el error de usuario no existe.*/
        try{
            const searchResult = await usersDAO.get({userEmail:email})
            /*Como se que devuelve arrays pero me devuelve 1 elemento deveulvo ese dto obtenido en posicion cero, y si el usuario no existe lanzo error...*/
            if (searchResult.length > 0) return searchResult[0]
            else throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersRepository.getUserByEmail|',`El usuario con emails ${email} no existe en la base de datos...`)
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserByEmail|','Error interno del servidor...')
        }
    }


    async getUserByCart(cartId){
       /*Busca en la BD por suun usuario por su cartId y lo devuelve, si no existe, devuelve el error de usuario no existe.*/
        try{
            const searchResult = await usersDAO.get({userCartId:cartId})
             /*Como se que devuelve arrays pero me devuelve 1 elemento deveulvo ese dto obtenido en posicion cero, y si el usuario no existe lanzo error...*/
             if (searchResult.length > 0) return searchResult[0]
            else throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersRepository.getUserByCart|',`El usuario con cartId ${cartId} no existe en la base de datos...`)
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
            const searchResult = await usersDAO.get({userId:userId})
              /*Como se que devuelve arrays pero me devuelve 1 elemento deveulvo ese dto obtenido en posicion cero, y si el usuario no existe lanzo error...*/
            if (searchResult.length > 0) return searchResult[0]
            else throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersRepository.getUserById|',`El usuario con usuario ${userId} no existe en la base de datos...`)
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.getUserById|','Error interno del servidor...')
        }
    }


    async setLastConnection(userEmail,newLastConnection){
        /* Setea el campo lastConnection del userEmail pasado por parametro.
           Devuelve un userDTO con el usuario ya modificado.
           Si hubo un problema durante la actualizacion devuelve error.
        */
        try{
            //Convertir en DATE ysi no se puede recuperar error en throw
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    lastConnection:new Date(newLastConnection)
                }})
            return updatedUser 
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setLastConnection|','Error interno del servidor...')
        }
    
    }

    async setPassword(userEmail,newPassword){
        /* Setea el campo password del userEmail pasado por parametro.
           Devuelve un userDTO con el usuario ya modificado.
           Si hubo un problema durante la actualizacion devuelve error.
        */
        try{
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


    async setRole({userEmail,newRole}){
          /* Setea el campo role del userEmail pasado por parametro.
           Devuelve un userDTO con el usuario ya modificado.
           Si hubo un problema durante la actualizacion devuelve error.
        */
       //validar queu sea un role valido en la BD
        try{
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

    
    //La usaremos para los users que inician sesion y estaban llenando su carro en el localsotrage lado cliente.
    async setCart(userEmail,newCartId){
          /* Setea el campo cart del userEmail pasado por parametro.
             Devuelve un userDTO con el usuario ya modificado.
            Si hubo un problema durante la actualizacion devuelve error.
        */
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


    //Lo vamos a usar para habilitar/inhabilitar usuarios en la app.
     async userSetEnabled(userEmail,newState){
        try{
              /* Setea el campo enabled del userEmail pasado por parametro.
                Devuelve un userDTO con el usuario ya modificado.
                Si hubo un problema durante la actualizacion devuelve error.
        */
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

    
    //Lo utilizaremos para el seteo de contraseñas.
    async setRecoveryPasswordInfo({userEmail,newRecoveryPasswordCode,newRecoveryPasswordExpiration}){
        /* Setea los campos recoveryPasswordCode y recoveryPasswordExpiration del userEmail pasado por parametro.
           Devuelve un userDTO con el usuario ya modificado.
           Si hubo un problema durante la actualizacion devuelve error.
        */
        //SI no se puede comvertir en DATE dara error
        try{
      
            const updatedUser = await usersDAO.update({
                userEmail:userEmail,
                updateObject:{
                    recoveryPasswordCode: newRecoveryPasswordCode,
                    recoveryPasswordExpiration: new Date(newRecoveryPasswordExpiration)
                }})
            return updatedUser 
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.setRecoveryPasswordInfo|','Error interno del servidor...')
        }
    
    }


    //Lo usaremos para modificar esta parte de informacion del perfil de usuario
    async setUserProfileInfo({userEmail,firstName,lastName,age}){
        /* Setea los campos firstName,lastName y age del userEmail pasado por parametro.
           Devuelve un userDTO con el usuario ya modificado.
           Si hubo un problema durante la actualizacion devuelve error.
        */
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
        /* Agrega el usuario userEmail el documento newDocName y la referencia newDocReference
           Devuelve un userDTO con el usuario ya modificado.
           Si hubo un problema durante la actualizacion devuelve error.
        */
        try{
            //Se busca el user en la base de datos y se mira su lista de documentos. Se le agrega el nuevo y se hace el update
            const searchedUser = await this.getUserByEmail(userEmail)  //if user no existe se lanza error por accion de la funcion getUserByEmail
            //Leo desde el dto la lista de documentos actual y le agrego el documento.
            const currentDocsList = searchedUser.documents
            currentDocsList.push({docName:newDocName,docReference:newDocReference})
            //Ahora inserto la lista ya actualizada a la base de datos y devuelvo el dto actualizado.
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
         /* Borra el al userEmail el documento docNameForDelete.
            Si el documento a borrar no existe, se lanza error.
            Devuelve un userDTO con el usuario ya modificado.
            Si hubo un problema durante la actualizacion devuelve erro por accion del update del dao.
        */
        try{
            //Se busca el user en la base de datos y se mira su lista de documentos. Se le agrega el nuevo y se hace el update
            const searchedUser = await this.getUserByEmail(userEmail)
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
        /*  Setea al userEmail el docNameForUpdate  con el valor newDocReference
            Si el documento a actualizar no existe, se lanza error.
            Devuelve un userDTO con el usuario ya modificado.
            Si hubo un problema durante la actualizacion devuelve erro por accion del update del dao.
        */
        try{
            //Se busca el user en la base de datos y se mira su lista de documentos. Se le agrega el nuevo y se hace el update
            const searchedUser = await this.getUserByEmail(userEmail)
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

    async deleteUser(userEmail){
       
        try{
            //Pide al DAO que borre el usuario. Si todo salio ok me da el dto y lo devuelvo
            //Si hubo algun problema o no existe esto va directamente a catch
           const result = await usersDAO.deleteUser(userEmail)
           return result
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.deleteUsersByEmail|','Error interno del servidor...')
        }
    }


    async deleteByLastConnectionBefore(selectedDate){
        //Pide el dao que borre los usuarios con conexion anterior a selectedDate
        //Devuelve [] si no hubo eliminados, o [UsersDTO] con los eliminados 
        try{
           const result = await usersDAO.deleteByLastConnection(selectedDate)
           return result
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersRepository.deleteByLastConnectionBefore|','Error interno del servidor...')
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
