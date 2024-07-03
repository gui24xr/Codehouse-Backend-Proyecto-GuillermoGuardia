import { UserModel } from "../../models/user.models.js";
import { UserDTOERROR, UsersServiceError } from "../../services/errors.service.js";
import { UserDTO } from "../../dto/users.dto.js";
import { isEmail } from "../../utils/helpers.js";

//Importar errores


export default class UsersMongoDao{

        //funcion interna para construir los DTO
    //Esta es interna de cada dao x lo cual no debe ser homologado
    //Lo que es homologado es el 
    getUserDTO(userFromDB){
        console.log('User de Mongo que llega para ser tranformado...',userFromDB)
        return new UserDTO({
            userId: userFromDB._id.toString(),
            email: userFromDB.email,
            password: userFromDB.password,
            firstName: userFromDB.first_name,
            lastName: userFromDB.last_name,
            age: userFromDB.age,
            role: userFromDB.role,
            cartId: userFromDB.cart,
            createdAt: userFromDB.createdAt,
            enabled: userFromDB.enabled,
            recoveryPasswordCode : userFromDB.recovery_password_info.code,
            recoveryPasswordExpiration : userFromDB.recovery_password_info.expiration,
            lastConnection: userFromDB.last_connection,
            documents:userFromDB.documents.map ( item => ({docName: item.name, docReference: item.reference}))
        })
    }

   
    async create({email,password,firstName,lastName,role,age,cartId}){
        /*
         Recibe un objeto con las propiedades para crear el uisuario. Si eventualmente viene la propiedad cartId entonces le pone ese cartId 
         al user creado ya que se podra crear users sin cartID
         Devuelve un DTO del user creado.
         Si existe un user con el mismo email se devuelve error.
         */
        try{
            const existUser = await UserModel.findOne({email:email})
            //Existe usuario no creo nada y salgo.
            if (existUser) throw new UsersServiceError(UsersServiceError.USER_EXIST_IN_DATABASE,'|UsersMongoDao.create|',`Ya existe usuario registrado con el email ${email}...`)
            //Si el user no existe prpcedo a crearlo.
            const newUser = new UserModel({ 
                email:email,
                password:password,
                first_name:firstName,
                last_name: lastName,
                age: age,
                role:role,
                cart: cartId || null
            })
            await newUser.save() // Lo guardo en la BD
            return this.getUserDTO(newUser) // Devuelvo el DTO
            } catch(error) {
                if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
                else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.create|')
            }
        }


  
    async getOne(searchObject){
        /*
            La utilizamos para obtener registros que son unicos.
            Devuelve un userDTO 
            Este metodo tiene las siguientes caracteristicas: 
            //Se podra llamar solamnete con una de las 3 propiedades por lo cual recibe como parametro:
                {userId} || {userEmail} || userCartId
            //Esto se hace para tener 3 alternativas de busqueda. 
            Por lo cual antes de entrar a buscar el usuario a la BD vamos a validar que el objeto solo tenga una de las 3 propiedades,
            //Se devuelve array porque en caso de lastConnection podemos usarlo para obtener todos los usuarios no conectados
        */      
        try{
            let searchResult;

            if ((Object.keys(searchObject).length == 1) && (Object.keys(searchObject).includes('userId' || 'userCartId' || 'userEmail' ))){ 
                //Ya me asegure el perfecto ingreso de parametros de busqueda, ahora segun que parametro vino busco lo solicitado.
                if (searchObject.userId) searchResult = await UserModel.findByOne({_id:searchObject.userId})
                if (searchObject.userEmail) searchResult = await UserModel.findByOne({email:searchObject.userEmail})
                if (searchObject.userCartId) searchResult = await UserModel.findByOne({cart:searchObject.userCartId})
                //Retorno el registro hallado en formato de DTO.
                return this.getUserDTO(searchResult)
            }
            else throw new UsersServiceError(UsersServiceError.GET_ERROR,'|UsersMongoDAO.getOne|',`Error en parametros de busqueda...`)
          
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getOne|')
        }
    }


    async getMany(filterObject){
        /*
            La utilizamos para obtener registros que la busqueda es por determinados criterios, o sea puede ser o no unicos. Devuelve un array de user DTO
            Este metodo tiene las siguientes caracteristicas: 
            //Se podra llamar solamnete con una de las 3 propiedades por lo cual recibe como parametro:
                {userId} || {userEmail} || userCartId ||
            //Esto se hace para tener 3 alternativas de busqueda. 
            Por lo cual antes de entrar a buscar el usuario a la BD vamos a validar que el objeto solo tenga una de las 3 propiedades,
            //Se devuelve array porque en caso de lastConnection podemos usarlo para obtener todos los usuarios no conectados
        */      
        try{
            let searchResult;

            if ((Object.keys(searchObject).length == 1) && (Object.keys(searchObject).includes('userId' || 'userCartId' || 'userEmail' ))){ 
                //Ya me asegure el perfecto ingreso de parametros de busqueda, ahora segun que parametro vino busco lo solicitado.
                if (searchObject.userId) searchResult = await UserModel.findByOne({_id:searchObject.userId})
                if (searchObject.userEmail) searchResult = await UserModel.findByOne({email:searchObject.userEmail})
                if (searchObject.userCartId) searchResult = await UserModel.findByOne({cart:searchObject.userCartId})
                //Retorno el registro hallado en formato de DTO.
                return this.getUserDTO(searchResult)
            }
            else throw new UsersServiceError(UsersServiceError.GET_ERROR,'|UsersMongoDAO.getMany|',`Error en parametros de busqueda...`)
          
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.getOne|')
        }
    }

    async delete(searchObject){
        /*   Elimina los usuarios 
            //Se podra llamar solamnete con una de las 3 propiedades por lo cual recibe como parametro:
            {userId} || {userEmail} || {userLastConnection} || userCartId
            //Esto se hace para tener 4 alternativas de busqueda. 
            Por lo cual antes de entrar a buscar el usuario a la BD vamos a validar que el objeto solo tenga una de las 
            4 propiedades,
            //Se devuelve array porque en caso de lastConnection podemos usarlo para obtener todos los usuarios no conectados
            //Obviamente en caso de email,id o cartId va a ser un array de un objeto.
            //De esta forma la funcion hace que no sea necesario pedir a la base de datos todos los usuarios y que repository los procese.
        */      
        try{
            let deleteResults;

            if ((Object.keys(searchObject).length == 1) && (Object.keys(searchObject).includes('userId' || 'userCartId' || 'userEmail' ||'userLastConnection'))){ 
                //Ya me asegure el perfecto ingreso de parametros de busqueda, ahora segun que parametro vino busco lo solicitado.
                if (searchObject.userId){
                    deleteResults = await UserModel.deleteOne({_id:searchObject.userId})
                }

                if (searchObject.userEmail){
                    deleteResults = await UserModel.deleteOne({email:searchObject.userEmail})
                }

                if (searchObject.userCartId){
                    deleteResults = await UserModel.deleteOne({cart:searchObject.userCartId})
                }

                if (searchObject.userLastConnection){
                    deleteResults = await UserModel.deleteMany({lastConnection:searchObject.userLastConnection})
                }
                //Como en todas use find entonces me devuelve un array y a ese array mando a hacer DTO con ellos.
                const userDTOArray = searchResults.map(item => (this.getUserDTO(item)))
                return userDTOArray
            }
            else throw new UsersServiceError(UsersServiceError.GET_ERROR,'|UsersMongoDAO.get|',`Error en parametros de busqueda...`)
          
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.get|')
        }
    }

}
