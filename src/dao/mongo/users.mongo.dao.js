import { UserModel } from "../../models/user.models.js";
import { UserDTOERROR, UsersServiceError } from "../../services/errors.service.js";
import { UserDTO } from "../../dto/user-dto/user.dto.js"
import { isEmail } from "../../utils/helpers.js";

//Importar errores


export default class UsersMongoDao{

        //funcion interna para construir los DTO
    //Esta es interna de cada dao x lo cual no debe ser homologado
    //Lo que es homologado es el 
    transformInUserDTO(userFromDB){
        console.log('dao::::',userFromDB, new Date())
        return new UserDTO({
            userId: userFromDB._id.toString(),
            email: userFromDB.email,
            password: userFromDB.password,
            firstName: userFromDB.first_name,
            lastName: userFromDB.last_name,
            age: userFromDB.age,
            role: userFromDB.role,
            cartId: userFromDB.cart,
            lastConnection: userFromDB.last_connection,
            documents:userFromDB.documents
        })
    }

    //recibe un objeto con los campos necesarios para la creacion de usuario (Si es con cart viene Id del cart, si es sin cart viene null).
    //Todo debe venir validado de la capa repository.
    //Si no existe user con dicho email lo crea (el modelo indica que es unique el campo.), si no, lanza un UsersServiceErrors
    //Crea el usuario y lo devuelve en un userDTO.
    async createUser(email,password,firstName,lastName,role,age,cartId){
        //Ingresa un DTO y devuelve el registro de mongo.
        //Que tengan carros los useer es parte de la logica de negocio
        try{
        const existUser = await UserModel.findOne({email:email})
        //Existe usuario no creo nada y salgo.
        if (existUser) throw new UsersServiceError(UsersServiceError.USER_EXIST_IN_DATABASE,'|UsersMongoDao.createUser|')
        //Si el user no existe prpcedo a crearlo.
        const newUser = new UserModel({
            email:email,
            password:password,
            first_name:firstName,
            last_name: lastName,
            age: age,
            role:role,
            cart: cartId
        })
        await newUser.save() // Lo guardo en la BD
        //Con la data construyo el user dto para devolver a la capa repository.
       return this.transformInUserDTO(newUser)
       /*return new UserDTO({
            userId: newUser._id.toString(),
            email: newUser.email,
            password: newUser.password,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            age: newUser.age,
            role: newUser.role,
            cartId: newUser.cart,
            lastConnection: newUser.last_connection,
            documents:newUser.documents
        })*/
            
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.createUser|')
        }
    }


    //Busca el user por ID en la base de datos.
    //Si existe devuelve un UserDTo, si no existe lanza una instancia de UsersSeriveError
    async getUserById(userId){
        try{
            const searchedUser = await UserModel.findOne({_id:userId})//.populate('cart')
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.getUserById|')
               /* return new UserDTO({
                    userId: searchedUser._id.toString(),
                    email: searchedUser.email,
                    password: searchedUser.password,
                    firstName: searchedUser.first_name,
                    lastName: searchedUser.last_name,
                    age: searchedUser.age,
                    role: searchedUser.role,
                    cartId: searchedUser.cart ? searchedUser.cart._id.toString() : null, //Si hay cart id en string, si no null.
                    lastConnection: searchedUser.last_connection,
                    documents:searchedUser.documents
                })
            */
            return this.transformInUserDTO(searchedUser)
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getUserById|')
        }
    }

    //Busca el user por email en la base de datos.
    //Si existe devuelve un UserDTo, si no existe lanza una instancia de UsersServiceError
    async getUserByEmail(email){
        try{
            const searchedUser = await UserModel.findOne({email:email})//.populate('cart')
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.getUserByEmail|')
              /*  return new UserDTO({
                    userId: searchedUser._id.toString(),
                    email: searchedUser.email,
                    password: searchedUser.password,
                    firstName: searchedUser.first_name,
                    lastName: searchedUser.last_name,
                    age: searchedUser.age,
                    role: searchedUser.role,
                    cartId: searchedUser.cart ? searchedUser.cart._id.toString() : null, //Si hay cart id en string, si no null.
                    lastConnection: searchedUser.last_connection,
                    documents:searchedUser.documents
                })
                 */   
                return this.transformInUserDTO(searchedUser)
        }catch(error){
            console.log('fdddfdfdfdfdfdddfderrorrrrr')
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getUserByEmail|')
        }
    }

    //filter es un objeto asi {email:email}
    async getUserByFilter(field,value){
        try{
            const searchedUser = await UserModel.findOne({[field]:value})//populate('cart')
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.getUserByEmail|')
               /* return new UserDTO({
                    userId: searchedUser._id.toString(),
                    email: searchedUser.email,
                    password: searchedUser.password,
                    firstName: searchedUser.first_name,
                    lastName: searchedUser.last_name,
                    age: searchedUser.age,
                    role: searchedUser.role,
                    cartId: searchedUser.cart ? searchedUser.cart._id.toString() : null, //Si hay cart id en string, si no null.
                    lastConnection: searchedUser.last_connection,
                    documents:searchedUser.documents
                })
                    */
                return this.transformInUserDTO(searchedUser)
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getUserByFilter|')
        }
    }


    //Recibe un user DTO y lo deja igual que el user DTO que ingresa, modifica el registro y devuelve el registro devuelvo.
    //Si no existe el usuario lanza error UsersServiceError.
    //Previamente se valida recibir una instancia de USERDTO
    //Recordar que el userId no pudo haber sido modificado gracias a que los userDTO no permiten la reasignacion de la propiedad userId.
    //Si x algun motivo no se pudo modificar devuelve un UsersServiceError Update error
    async updateUser(receivedUser){
        //Si no me dio un cartDTO salgo
        console.log('En mongo update: ', receivedUser)
        try{
            if (!(receivedUser instanceof UserDTO)) throw new UsersServiceError(UsersServiceError.UPDATING_ERROR,'|UsersMongoDao.updateUser|','El objeto recibido no es una instancia de UserDTO.')
                //Leo cartDTO y actuo . Primero busco el user
            const searchedUser = await UserModel.findOne({_id:receivedUser.userId})
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.updateUser|','El usuario ya no existe...')
                //Si el user existe trabajo sobre el mismo y luego luego lo guardo.
                searchedUser.email = receivedUser.email;
                searchedUser.password = receivedUser.password;
                searchedUser.first_name = receivedUser.firstName;
                searchedUser.last_name = receivedUser.lastName;
                searchedUser.age = receivedUser.age;
                searchedUser.role = receivedUser.role;
                searchedUser.cart = receivedUser.cartId;
                searchedUser.last_connection = receivedUser.lastConnection;
                searchedUser.documents = receivedUser.documents;
    
                // Guardar los cambios en la base de datos
                await searchedUser.save()
               /* return new UserDTO({
                    userId: searchedUser._id.toString(),
                    email: searchedUser.email,
                    password: searchedUser.password,
                    firstName: searchedUser.first_name,
                    lastName: searchedUser.last_name,
                    age: searchedUser.age,
                    role: searchedUser.role,
                    cartId: searchedUser.cart ,// searchedUser.cart._id.toString() : null, //Si hay cart id en string, si no null.
                    lastConnection: searchedUser.last_connection,
                    documents:searchedUser.documents
                })
                 */   
                return this.transformInUserDTO(searchedUser)
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.updateUser|')
        }
    }

    //Borrar usuario por email. Si no existe devuelve error xq no se puede borrar lo que no existe.
    //Recibe un email, busca el user, lo borra y devuelve un userDTO con el registro borrado.
    // Si no lo borra devuelve una instancia de error.
    async deleteUserByEmail(email){
        try{
            //Si no es email, lanza instancia de error.
            if (!(isEmail(email))) throw new UsersServiceError(UsersServiceError.DELETING_ERROR,'|UsersMongoDao.deleteUser|','No se ingreso un email valido para buscar el registro...')
            const deletedUser = await UserModel.findOneAndDelete({ email: email })
            if (deletedUser){
              /*  return new UserDTO({
                    userId: deletedUser._id.toString(),
                    email: deletedUser.email,
                    password: deletedUser.password,
                    firstName: deletedUser.first_name,
                    lastName: deletedUser.last_name,
                    age: deletedUser.age,
                    role: deletedUser.role,
                    cartId: deletedUser.cart ,// searchedUser.cart._id.toString() : null, //Si hay cart id en string, si no null.
                    lastConnection: deletedUser.last_connection,
                    documents:deletedUser.documents
                })
               */     
                return this.transformInUserDTO(deletedUser)
            } 
            else throw new UsersServiceError(UsersServiceError.DELETING_ERROR,'|UsersMongoDao.deleteUser|','No se pudo borrar el registro ya que el user no existe...')
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.deleteUser|')
        }
    }
       
}