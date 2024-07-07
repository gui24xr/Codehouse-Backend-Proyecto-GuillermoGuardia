import { UsersService } from "../services/users.service.js";
import { InputValidationService } from "../services/validation.service.js";
import {UsersServiceError, InputValidationServiceError} from "../services/errors.service.js";



const usersService = new UsersService();

export class UsersController {

  async getUsers(req,res,next){
    //Devuelve los datos todos los usuarios existentes en la BD.
    try{
        const usersList = await usersService.getAllUsers()
        if (usersList.length > 0){
          res.status(201).json({
            status: "success",
            message: `Lista de usuarios en la BD...`,
            usersList: usersList
          })
        }else{
          res.status(201).json({
            status: "success",
            message: `En este momento no hay usuarios en la BD...`,
            usersList: usersList
          });
        }
    }catch(error){
      if (error instanceof UsersServiceError) next(error);
      else {
        next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.getUsers|","Error interno del servidor..."))
      }
    }
  }



  async deleteInactiveUsers(req,res,next){
    try{
      const deletedUsersList = await usersService.deleteInactiveUsers()
      if (deletedUsersList.length > 0){
        res.status(201).json({
          status: "success",
          message: `Se han borrado por inactividad esta lista de usuarios...`,
          usersList: deletedUsersList
        })
      } else{
        res.status(201).json({
          status: "success",
          message: `No se borraron usuarios de la base de datos ya que no hay users inactivos segun el tiempo de inactividad transcurrido determinado...`,
          usersList: deletedUsersList
        })}
    }catch(error){
      if (error instanceof UsersServiceError) next(error);
      else {
        next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.deleteInactiveUsers|","Error interno del servidor..."))
      }
    }
  }

  
  async deleteUser(req,res,next){
    //Borra un usuario por su email. Si no existe, lanza error.
    const {email} = req.body 
    try{
      //Pasamos por la capa de validacion
      InputValidationService.checkRequiredField(req.body,['email'],'UsersController.deleteUser')
      InputValidationService.isEmail(email)
      
      //Si todo salio OK entonces pedimos a la capa de servicio la eliminacion del user.
      const deletedUser = await usersService.deleteUserByEmail(email)
      //SI el user no es borrado eoso va por el camino de catch, x lo cual si todo salio OK podemos devolver...
      res.status(201).json({
        status: "success",
        message: `Se elimino al user ${deletedUser.email}.`,
        deletedUser: deletedUser
      })
    }catch(error){
      if (error instanceof UsersServiceError || error instanceof InputValidationServiceError) next(error);
      else {
        next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.deleteUser|","Error interno del servidor..."))
      }
    }
  }



  async updateUserRole(req,res,next){
    const {email,new_role} = req.body
    try{
      //Pasamos por la capa de validacion.
      InputValidationService.checkRequiredField(req.body,['email','new_role'],'UsersController.updateUserRole')
      InputValidationService.isEmail(email)
      InputValidationService.isValidRole(new_role)
    
      //Si todo salio OK le pedimos al servicio updatear el rol de user.
      const updatedUser = await usersService.changeUserRole({userEmail:email,newRole:new_role})
   
      res.status(201).json({
        status: "success",
        message: `Se elimino al user ${updatedUser.email}.`,
        updatedUser: updatedUser
      })
    }catch(error){
      if (error instanceof UsersServiceError || error instanceof InputValidationServiceError) next(error);
      else {
        next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.updateUserRole|","Error interno del servidor..."))
      }
    }
    }


    async createRecoveryCode(req,res,next){
      const {email} = req.body

      try{
        //Pasamos por la capa de validacion.
        InputValidationService.checkRequiredField(req.body,['email'],'UsersController.createRecoveryCode')
        InputValidationService.isEmail(email)
        //Le pedimos al servicio de usuario que cree para el user un recoveryCode y una fecha de caducidad para el cambio de password
        const recoveryPasswordData = await usersService.createRecoveryCodeForUser(email)

        res.status(201).json({
          status: "success",
          message: `Se envio un mail a ${recoveryPasswordData.email} para que recuperes tu contraseña y tenes tiempo hasta ${recoveryPasswordData.expiration}.`,
          
        })

      }catch(error){
        if (error instanceof UsersServiceError || error instanceof InputValidationServiceError) next(error);
        else {
          next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.createRecoveryCode|","Error interno del servidor..."))
        }
      }
    }


    async changeUserPassword(req,res,next){
      const {email,recovery_code,new_password} = req.body
      try{
        //Pasamos por la capa de validacion
        InputValidationService.checkRequiredField(req.body,['email','recovery_code','new_password'],'UsersController.changeUserPassword')
        InputValidationService.isEmail(email)
        //Una vez que pasamos la capa de validacion ejecutamos el servicio de reemplazo de passwords olvidados
        await usersService.resetPassword({
          userEmail:email,
          recoveryCode: recovery_code,
          newPassword: new_password
        })

        //Ya que nos devuelve true si todo salio OK, y error si salio mal
        res.status(201).json({
          status: "success",
          message: `Tu password fue cambiado con exito ! Ya podes iniciar sesion !!.`,
          
        })
      }catch(error){
        if (error instanceof UsersServiceError || error instanceof InputValidationServiceError) next(error);
        else {
          next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.changeUserPassword|","Error interno del servidor..."))
        }
      }
    }

  }

