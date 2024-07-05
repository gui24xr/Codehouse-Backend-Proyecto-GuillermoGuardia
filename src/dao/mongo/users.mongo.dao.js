import { UserModel } from "../../models/user.models.js";
import { UserDTOERROR, UsersServiceError } from "../../services/errors.service.js";
import { UserDTO } from "../../dto/users.dto.js";
import { isEmail } from "../../utils/helpers.js";
import { query } from "express";

//Importar errores


export default class UsersMongoDao{

        //funcion interna para construir los DTO
    //Esta es interna de cada dao x lo cual no debe ser homologado
    //Lo que es homologado es el 
    getUserDTO(userFromDB){
        return new UserDTO({
            userId: userFromDB._id.toString(),
            email: userFromDB.email,
            password: userFromDB.password,
            firstName: userFromDB.firstName,
            lastName: userFromDB.lastName,
            age: userFromDB.age,
            role: userFromDB.role,
            cartId: userFromDB.cart,
            createdAt: userFromDB.createdAt,
            enabled: userFromDB.enabled,
            recoveryPasswordCode : userFromDB.recoveryPasswordCode,
            recoveryPasswordExpiration : userFromDB.recoveryPasswordExpiration,
            lastConnection: userFromDB.lastConnection,
            documents: userFromDB.documents.map ( item => ({docName: item.docName, docReference: item.docReference}))
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
                firstName:firstName,
                lastName: lastName,
                age: age,
                role: role,
                cart: cartId || null
            })
            await newUser.save() // Lo guardo en la BD
            return this.getUserDTO(newUser)// Devuelvo el DTO
            } catch(error) {
                if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
                else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.create|')
            }
        }


  
    async get(queryObject){
        /* Puede funcionar de 2 formas:
            A- Si no se pasa por parametro un queryObject devuelve un array de UserDTO con todos los registros de la coleccion.
            B- Si se pasa por parametro un queryObject este query object es un objeto que puede tener una sola propiedad y esas propiedades
                pueden ser 3: userId,userEmail,userCartId para buscar por uno u otro campo ya que son campos unique.
                Si en el objeto se pasa mas de una propiedad EJ:{userId:valor,userEmail:valor} entonces lanza error en  la busqueda.
            En ambos casos devuelve array de UserDTO, obviamente si no existe el registro devuelve array vacio, y en caso de busqueda por
           email,userId o cartId sera un array de un solo elemento.
            */
        try{
            let searchResult;
            if (queryObject){
                if ((Object.keys(queryObject).length == 1) && 
                    (Object.keys(queryObject).includes('userId') || Object.keys(queryObject).includes('userCartId') || Object.keys(queryObject).includes('userEmail'))){ 
                    //Ya me asegure el perfecto ingreso de parametros de busqueda, ahora segun que parametro vino busco lo solicitado.
                    if (queryObject.userId) searchResult = await UserModel.findOne({_id:queryObject.userId})
                    if (queryObject.userEmail) searchResult = await UserModel.findOne({email:queryObject.userEmail})
                    if (queryObject.userCartId) searchResult = await UserModel.findOne({cart:queryObject.userCartId})
                    //Retorno el registro hallado en formato de DTO pero en un array... use findOne para hacer una busqueda mas rapida en caso de registros unicos...
                    //Si no encuentra resultado devuelve array vacio ( o sea en caso que venga null el resultado de findOne)
                    if (searchResult == null) return [] 
                    else return [this.getUserDTO(searchResult)]
                }
                else throw new UsersServiceError(UsersServiceError.GET_ERROR,'|UsersMongoDAO.get|',`Error en parametros de busqueda, solo se puede recibir una propiedad pero se recibieron ${Object.keys(queryObject).length}, ${Object.keys(queryObject)}...`)
            }
            else{
                //SI no hay query object devolvemos toda la coleccion en array de userDTO
                searchResult = await UserModel.find()
                return searchResult.map(item => (this.getUserDTO(item)))
            }
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.get|')
        }
    }


    
    async update({userEmail,updateObject}){
        /*
          1- Recibe un objetos con la informacion de lo que hay que actualizar.
          { userEmail: emailDelUserActualizar
            updateObject: {campo1: valor, campo2: valor... campoN:valor}]
          }
            docName se actualiza direcamente ponendo una lista de elementos [{docName:'dgdgd',docReference:'dgdgdd'}]
          Las propiedades del objeto seran validada, solo puede traer los campos password,firstName,lastName,age,role,cartId,enabled,recoverypasswordCode,
          recoveryPasswordExpiration,lastConnection.
          En caso de mongo se usa el mismo objeto, en caso de otro DAO segun la estructura que se implemente se transformara.
          2- Si la lista es valida se procede a la modificacion.
        */
        try{
            
            //Valido el updateObject,Realizo intersección entre clavesObjeto y conjuntoPermitidas
            const allowUpdateProps = new Set(['email','password','firstName','lastName','age','role','cartId','enabled','recoveryPasswordCode','recoveryPasswordExpiration','lastConnection','documents']) 
            const arrayOfNotAllowPropsInUpdateObject = Object.keys(updateObject).filter(prop => !allowUpdateProps.has(prop))
            //Si la lista de propiedades no permitidas tiene elementos lanzo error
            if (arrayOfNotAllowPropsInUpdateObject.length > 0) throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.update|',`Hay propiedades no permitidas en el updateObject => O_O ${arrayOfNotAllowPropsInUpdateObject}. O_O!`)
            //Serianecesario hacer una validacion opcional para que venga en cada campo el tipo de dato esperado segun la BD usada.

            //Ahora que estoy seguro que tengo los campos correctos para actualizar mis datos en BD
                
            const updatedUser = await UserModel.findOneAndUpdate(
                { email: userEmail }, // Criterios de búsqueda
                {...updateObject},
                { new: true } // Opciones: Devolver el documento actualizado
                )
        
                if (!updatedUser) {
                    throw new UsersServiceError(UsersServiceError.USER_NO_EXIST,'|UsersMongoDAO.update|','No se puede hacer update sobre un usuario inexistente...')
            
                }
            //Devuelvo el DTO
           return this.getUserDTO(updatedUser)
            
        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.update|')
        }
    }

    
    
    async deleteByUsersList(usersListForDelete){
        /* Borra una lista de usuarios. La lista es una lista con los emails */
        try{
            //Valido que sean email, de lo contrario lanzo error.
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            usersListForDelete.forEach(item => {
                if (!emailRegex.test(item))throw new UsersServiceError(UsersServiceError.DELETING_ERROR,'|UsersMongoDAO.deleteByUsersList|','En la lista de users a borrar hay datos que no son email...')
            })

            //Quitar repetidos(SI los hubiese) para no hacer peticiones demas a la BD.
            const usersToDelete = [...new Set(usersListForDelete)] //Esto es una lista de emails.
            
            //Preparo el filtro para eliminar
            const conditionsForDelete = { email: { $in: usersToDelete } };

            //Busco en la BD los usuarios antes de eliminarlos...
            const listOfUsersToDelete = await UserModel.find(conditionsForDelete)
            if (!listOfUsersToDelete || listOfUsersToDelete.length === 0) {
                throw new UsersServiceError(UsersServiceError.DELETING_ERROR, '|UsersMongoDAO.deleteByUsersList|', 'No se encontraron usuarios para eliminar.');
            }

            //Estando todo en condiciones procedo al borrado....
            const deleteResult = await UserModel.deleteMany(conditionsForDelete)
           
            //SI no todos fueron borrados lanzo error.
            if (deleteResult.deletedCount < listOfUsersToDelete) throw new UsersServiceError(UsersServiceError.DELETING_ERROR,'|UsersMongoDAO.deleteByLastConnection|','Uno o mas registros no pudieron ser borrados correctamente...')
            
            //Convierto la lista en DTO y la devuelvo
            const deletedUsersDTO = listOfUsersToDelete.map(item => (this.getUserDTO(item)))
            return deletedUsersDTO 

        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.deleteByUsersList|')
        }
    }



    async deleteByLastConnection(selectedLastConnection){
        /* Borra todos los usuarios que su lastConnection sea anterior  lastConnection. 
           Si no se encuentran usuarios a eliminar o se eliminan menos por alguna circunstancia lanza error.
           Si el string de fecha pasado por parametro no cumple condiciones tambien lanza error.
        */
        try{
            //Preparo las condiciones de borrado
            const conditionDate = new Date(selectedLastConnection)
            const conditionsForDelete = { lastConnection : {$lt: conditionDate}}

            //Obtengo de la Base de datos todos los user que cumplen la condicion y me los guardo
            const listOfUsersToDelete = await UserModel.find(conditionsForDelete)
            
            //SI ninguno cumple la condicion lanzo error.
            if (!listOfUsersToDelete || listOfUsersToDelete.length === 0) {
                throw new UsersServiceError(UsersServiceError.DELETING_ERROR, '|UsersMongoDAO.deleteByLastConnection|', 'No se encontraron usuarios para eliminar.');
            }

            //Procedo a borrar.
            const deleteResult = await UserModel.deleteMany(conditionsForDelete)
           
            //Si alguno no fue borrado lanzo error.
            if (deleteResult.deletedCount < listOfUsersToDelete) throw new UsersServiceError(UsersServiceError.DELETING_ERROR,'|UsersMongoDAO.deleteByLastConnection|','Uno o mas registros no pudieron ser borrados correctamente...')
            
            //Devuielvo dto con la lista de borrados.
            const deletedUsersDTO = listOfUsersToDelete.map(item => (this.getUserDTO(item)))
            return deletedUsersDTO 

        }catch(error){
            if (error instanceof UsersServiceError || error instanceof UserDTOERROR) throw error
            else throw new UsersServiceError(UsersServiceError.INTERNAL_SERVER_ERROR,'|UsersMongoDAO.deleteByLastConnection|',error)
        }
    }


}
