import { UsersService } from "../services/users.service.js";
import { UsersServiceError, InputValidationServiceError} from "../services/errors.service.js";
import { InputValidationService } from "../services/validation.service.js";

const usersService = new UsersService()

export class SessionsController{

    async registerUser(req, res, next) {
        //Tomo los datos desde req.body
        const {email, password, first_name, last_name, age, role } = req.body
        const requiredFields = ["email","password","first_name","last_name","age"]
        
        try {
            //Paso por la capa de validacion la cual lanza una instancia de  error si hay problemas en los datos ingresados.
            InputValidationService.checkRequiredField(req.body,requiredFields,'SessionsController.registerUser')
            InputValidationService.isValidRole(req.body.role)
            const createdUser = await usersService.createUser({
                email:email,
                password: password,
                firstName: first_name,
                lastName:last_name,
                age: age,
                role:role
            })
            //Si el user creo correctamente respondo al cliente con 201.
            res.status(201).json({
                status: "success",
                message: "El usuario ha sido creado correctamente.",
                user: createdUser,
            })
        } catch (error) {
           if (error instanceof InputValidationServiceError|| error instanceof UsersServiceError){
              next(error)
            }
            else {
              next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.createUser|"))
          }
        }
      }

    
   
      async loginUser(req, res, next) {
        //Tomo los datos ingresados por el cliente.
        const { email, password } = req.body
        const requiredFields = ["email", "password"];
    
        try {
            //Paso por la capa de validacion la cual lanza una instancia de  error si hay problemas en los datos ingresados.
            InputValidationService.checkRequiredField(req.body,requiredFields,'SessionsController.loginUser')
            //Si paso de este punto entonces estamos en condiciones de iniciar sesion.
            const authenticateUser = await usersService.authenticateUser(email,password)
            //SI la autenticacion salio OK enviamos la cookie al cliente a travez de la respuesta.
            res.cookie(process.env.COOKIE_AUTH_TOKEN, authenticateUser.userToken, {
                signed: true,
                maxAge: 3600000,
                httpOnly: true,
            })
            //Respondemos con status 201 y devolvemos el user DTO del user logueado con su lastConnection actualizado.
            res.status(200).json({
                status: "success",
                message: `El usuario ${authenticateUser.userData.email} ha iniciado sesion correctamente...`,
                user: authenticateUser.userData
            })
        } catch (error) {
                if (error instanceof InputValidationServiceError ||  error instanceof UsersServiceError) next(error)
                else next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR, "|UsersControllers.authenticateUser|","Error interno del servidor..."))
          }
        }
      
    
    
      async logoutUser(req, res, next) {
        //Cierra la sesion del currentUser
        //Ejecuta el servicio de logout para elreq.currentUser por params al se cual se le setea last_connection
        //Si eso salio todo ok entonces invalida la cookie del token y setea las res que se usan para el render de plantillas
        const { userId, email } = req.currentUser
        try {
          const updatedUser = await usersService.logout(userId)
          //Inavalidamos la cookie.
          res.clearCookie(process.env.COOKIE_AUTH_TOKEN); //Limpíamos la cookie.
          res.locals.sessionData.login = false; // Seteamos las variables de handbars
          //Enviamos respuesta
          res.status(201).json({
            status: "success",
            message: `El user ${email} cerro sesion !!`,
            hour: updatedUser.lastConnection,
          });
        } catch (error) {
          if (error instanceof UsersServiceError) next(error);
          else {
            next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.logout|","Error interno del servidor..."))
          }
        }
      }
    

    async currentRoute(req, res, next) {
        //Voy a tomar el currentUer que viene en middleware que extrae la data del token 'verifyTokenMiddleware'.
        //Hay currentuser? devuelvo la data
        //No hay currentUser? devuelvo 'No Hay currentUser'
        //Hay error en el middleware que extrae los datos del token? se va por catch al handler de errores.
        try {
          req.currentUser
            ? res.json({
                message: "Existe user con token activo...",
                user: req.currentUser,
              })
            : res.json({
                message: "No Existe user con token activo...",
              });
        } catch (error) {
          next(new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,"|UsersControllers.currentRoute|","Error interno del servidor..."))  
         }
      }
    

}
