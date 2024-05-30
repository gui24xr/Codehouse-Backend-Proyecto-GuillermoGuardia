import { UsersRepository } from "../repositories/users.repositories.js";
import {createHash, isValidPassword} from "../utils/hashbcryp.js"
import { generateJWT } from "../utils/jwt.js";
import { IncompleteFieldsError, UsersServiceError, InternalServerError } from "../services/errors/custom-errors.js";
import { getMissingFields } from "../utils/getMissingFields.js";


const usersRepository = new UsersRepository()

export class UsersController{
    
    async createUser(req,res,next){
        const {first_name, last_name, email, password,age, role} = req.body;
        const requiredFields = ['first_name', 'last_name', 'email', 'password','age']
        const missingFields = getMissingFields(req.body,requiredFields)
       
         try {
             //Controlamos que no falten datos necesarios para crear un user....
            if (missingFields.length > 0)  throw new IncompleteFieldsError(`Faltan ingresar los siguientes campos: ${missingFields}`)
             //SI Estan todos los campos necesarios entonces se procede...
                
            const createdUser = await usersRepository.createUser({
                first_name : first_name,
                last_name : last_name,
                email: email,
                password: createHash(password),
                age: age,
                role: role
            })
      
           res.status(201).json({
            status: "success", 
            message: "El usuario ha sido creado correctamente.",
            user:createdUser
            })
                    
        }
        catch(error){
            if (error instanceof IncompleteFieldsError || error instanceof  UsersServiceError) next(error)
            else {
                next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersController.createUser||...'))
            }
        }
    }

    //Si autenticamos metemos al req el currentUser
    async authenticateUser(req,res,next){
        const {email,password} = req.body 
        const requiredFields = [ 'email', 'password']
        const missingFields = getMissingFields(req.body,requiredFields)
        console.log('llego a authenticate')
        try {
             //Controlamos que no falten datos necesarios para iniciar sesion...
            if (missingFields.length > 0)  throw new IncompleteFieldsError(`Faltan ingresar los siguientes campos: ${missingFields}`)
             //SI Estan todos los campos necesarios entonces se procede...
             const authenticateUser = await usersRepository.authenticateUser(email,password)
             res.cookie(process.env.COOKIE_AUTH_TOKEN, generateJWT(authenticateUser), {signed:true , maxAge: 3600000,  httpOnly: true  })
              
             res.status(200).json({
                status: "success", 
                message: `El usuario ${authenticateUser.email} ha iniciado sesion correctamente...`,
                user:authenticateUser
                })
                        
        } catch (error) {
            if (error instanceof IncompleteFieldsError || error instanceof  UsersServiceError) next(error)
                else {
                    next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersController.createUser||...'))
                }
        }
       
    }

    async clearTokenSession(req,res,next){
        res.clearCookie(process.env.COOKIE_AUTH_TOKEN);
        res.locals.sessionData.login = false;
        res.status(200).json({
            status: "success", 
            message: `Se ha cerrado sesion.`,
           
            })
     
    }


    async currentRoute(req,res,next){
        //Voy a tomar el currentUer que viene en middleware que extrae la data del token 'verifyTokenMiddleware'.
        //Hay currentuser? devuelvo la data
        //No hay currentUser? devuelvo 'No Hay currentUser'
        //Hay error en el middleware que extrae los datos del token? se va por catch al handler de errores.
        try{
            //console.log(req.currentUser)
            req.currentUser 
            ? 
            res.json({
                message: 'Existe user con token activo...',
                user: req.currentUser
            })
            :
            res.json({
                message: 'No Existe user con token activo...'
            })
        }catch(error){
            next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersController.currentRoute||...'))
        }
    }
    

    
}