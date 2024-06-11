import { UserModel } from "../../models/user.models.js";
import { UsersServiceError } from "../../services/errors.service.js";
import { UserDTO } from "../../dto/user-dto/user.dto.js"
import { isEmail } from "../../utils/helpers.js";

//Importar errores


export default class UsersMongoDao{

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
        return new UserDTO({
            userId: searchedUser._id.toString(),
            email: newUser.email,
            password: newUser.password,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            age: newUser.age,
            role: newUser.role,
            cartId: newUser.cart
        })
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.createUser|')
        }
    }


    //Busca el user por ID en la base de datos.
    //Si existe devuelve un UserDTo, si no existe lanza una instancia de UsersSeriveError
    async getUserById(userId){
        try{
            const searchedUser = await UserModel.findOne({id:userId})//.populate('cart')
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.getUserById|')
            return new UserDTO({
                userId: searchedUser._id.toString(),
                email: searchedUser.email,
                password: searchedUser.password,
                firstName: searchedUser.first_name,
                lastName: searchedUser.last_name,
                age: searchedUser.age,
                role: searchedUser.role,
                cartId: searchedUser.cart
            })
            
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getUserById|')
        }
    }

    //Busca el user por email en la base de datos.
    //Si existe devuelve un UserDTo, si no existe lanza una instancia de UsersServiceError
    async getUserByEmail(email){
        try{
            const searchedUser = await UserModel.findOne({email:email}).populate('cart')
            if (!searchedUser) throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDao.getUserByEmail|')
                
                console.log('En persistencia salio: ', searchedUser)
                return new UserDTO({
                    userId: searchedUser._id.toString(),
                    email: searchedUser.email,
                    password: searchedUser.password,
                    firstName: searchedUser.first_name,
                    lastName: searchedUser.last_name,
                    age: searchedUser.age,
                    role: searchedUser.role,
                    cartId: searchedUser.cart ? searchedUser.cart._id.toString() : null // Asegúrate de que cartId sea el _id del objeto cart
                })
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getUserByEmail|')
        }
    }


    //Recibe un user DTO y lo deja igual que el user DTO que ingresa, modifica el registro y devuelve el registro devuelvo.
    //Si no existe el usuario lanza error UsersServiceError.
    //Previamente se valida recibir una instancia de USERDTO
    //Recordar que el userId no pudo haber sido modificado gracias a que los userDTO no permiten la reasignacion de la propiedad userId.
    //Si x algun motivo no se pudo modificar devuelve un UsersServiceError Update error
    async updateUser(receivedUser){
        //Si no me dio un cartDTO salgo
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
                searchedUser.userRole = receivedUser.userRole;
                searchedUser.cart = receivedUser.cart;
    
                // Guardar los cambios en la base de datos
                await searchedUser.save()
                return new UserDTO({
                    userId: searchedUser._id.toString(),
                    email: searchedUser.email,
                    password: searchedUser.password,
                    firstName: searchedUser.first_name,
                    lastName: searchedUser.last_name,
                    age: searchedUser.age,
                    role: searchedUser.role,
                    cartId: searchedUser.cart
                })
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
                return new UserDTO({
                    userId: searchedUser._id.toString(),
                    email: deletedUser.email,
                    password: deletedUser.password,
                    firstName: deletedUser.first_name,
                    lastName: deletedUser.last_name,
                    age: deletedUser.age,
                    role: deletedUser.role,
                    cartId: deletedUser.cart
                })
            } 
            else throw new UsersServiceError(UsersServiceError.DELETING_ERROR,'|UsersMongoDao.deleteUser|','No se pudo borrar el registro ya que el user no existe...')
        }catch(error){
            if (error instanceof UsersServiceError) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.deleteUser|')
        }
    }
       
}