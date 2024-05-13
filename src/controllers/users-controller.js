import { UsersRepository } from "../repositories/users.repositories.js";
import {createHash, isValidPassword} from "../utils/hashbcryp.js"
import { generateJWT } from "../utils/jwt.js";
import { IncompleteFieldsError, usersServiceError, AuthServiceError } from "../services/errors/custom-errors.js";
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
      
           res.status(200).json({
            status: "success", 
            message: "El usuario ha sido creado correctamente.",
            user:createdUser
            })
                    
        }
        catch(error){
            if (error instanceof IncompleteFieldsError) next(error)
            if (error instanceof  usersServiceError) next(error)
        }
    }

    async authenticateUser(req,res,next){
        const {email,password} = req.body 
        const requiredFields = [ 'email', 'password']
        const missingFields = getMissingFields(req.body,requiredFields)
       
        try {
             //Controlamos que no falten datos necesarios para iniciar sesion...
            if (missingFields.length > 0)  throw new IncompleteFieldsError(`Faltan ingresar los siguientes campos: ${missingFields}`)
             //SI Estan todos los campos necesarios entonces se procede...
             const authenticateUser = await usersRepository.authenticateUser(email,password)
             res.cookie(process.env.COOKIE_AUTH_TOKEN, generateJWT(authenticateUser), {maxAge: 3600000,  httpOnly: true  })
              
             res.status(200).json({
                status: "success", 
                message: `El usuario ${authenticateUser.email} ha iniciado sesion correctamente...`,
                user:authenticateUser
                })
                        
        } catch (error) {
            if (error instanceof IncompleteFieldsError) next(error)
            if (error instanceof  usersServiceError) next(error)
            if (error instanceof  AuthServiceError) next(error)
        }
       
    }

    async clearTokenSession(req,res){
        res.clearCookie(process.env.COOKIE_AUTH_TOKEN);
        res.locals.sessionData.login = false;
        res.status(200).json({
            status: "success", 
            message: `Se ha cerrado sesion.`,
           
            })
     
    }


    async currentRoute(req,res){
        //Voy a tomar el user que viene en middleware
        res.json(req.user)
    }
    

    
}