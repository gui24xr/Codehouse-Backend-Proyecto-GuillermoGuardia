import mongoose from "mongoose";
import UsersMongoDao from "../src/dao/mongo/users.mongo.dao.js";
import Assert from 'assert';
import { UserDTO } from "../src/dto/users.dto.js";
import { UsersServiceError } from "../src/services/errors.service.js";



const userPrueba0 = { email: 'usuarioprueba0', password: '123456', firstName: 'Juan', lastName: 'Pérez', age: 30, role: 'user' }
const arrayUsersPrueba = [
    { email: 'usuarioprueba1', password: '123456', firstName: 'Juan', lastName: 'Pérez', age: 30, role: 'user' },
    { email: 'usuarioprueba2', password: '123456', firstName: 'María', lastName: 'García', age: 25, role: 'user' },
    { email: 'usuarioprueba3', password: '123456', firstName: 'Pedro', lastName: 'Sánchez', age: 35, role: 'user' },
    { email: 'usuarioprueba4', password: '123456', firstName: 'Ana', lastName: 'Martínez', age: 28, role: 'user' },
    { email: 'usuarioprueba5', password: '123456', firstName: 'Luis', lastName: 'López', age: 32, role: 'user' },
    { email: 'usuarioprueba6', password: '123456', firstName: 'Elena', lastName: 'Rodríguez', age: 27, role: 'user' },
    { email: 'usuarioprueba7', password: '123456', firstName: 'Carlos', lastName: 'Fernández', age: 31, role: 'user' },
    { email: 'usuarioprueba8', password: '123456', firstName: 'Sara', lastName: 'Gómez', age: 29, role: 'user' }
]



const connectResult = await mongoose.connect('mongodb+srv://gui24xrdev:2485javiersolis@cluster0.a6zgcio.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
if (connectResult) {
    console.log('Conexión exitosa con MongoDB!');
} else {
    console.error('Error al conectar con MongoDB:', connectResult);
}


//-----------------------------
function allELementsAreInstanceOf(listOfElements,className){
    const result = true //Supongo que todos son falsos.
    for (const element of listOfElements) {
        if (!element instanceof className) {
            result = false
            break
        }
    }
    return result
}
//-----------------------------


const assert = Assert.strict;

describe('Testing de users.mongo.dao METODO CREATE', function(){
    
    before(function(){
        this.usersDao = new UsersMongoDao()
    })

    this.afterAll(function (){
        mongoose.connection.collections.users.drop()
    
    })
    

    it('EL metodo create debe crear y devolver la instancia dl UserDTO creado.',async function(){
        const result = await this.usersDao.create({...userPrueba0})
        assert.strictEqual(result instanceof UserDTO,true)
    })

    it('EL metodo create({objetoUsuario}) crea los usuarios del array de pruebas...',async function(){

        try{
            const listOfCreatedUsers = []
            let createdUser
            for(const element of arrayUsersPrueba)
            {
                createdUser = await this.usersDao.create({...element}) //Creo cada user
                listOfCreatedUsers.push(createdUser)
            }
            //Si todo salio OK entonces tendriamos un array de 7 elementos userDTO
            const condition1 = Array.isArray(listOfCreatedUsers) && result.length == 8
            const condition2 = allELementsAreInstanceOf(listOfCreatedUsers,UserDTO)
            assert.strictEqual(condition1 && condition2, true)
        }catch(error){

        }
    })

    it('EL metodo create({objetoUsuario}) debe devolver error ya que ...usersPrueba0 ya existe en la BD .',async function(){
        
        try{
            const result = await this.usersDao.create({...userPrueba0})
            if (result) assert.fail('Fallo porque creo un usuario a pesar de ya existir el mismo...')
        }catch(error){
            const condition = error instanceof UsersServiceError && error.code == UsersServiceError.USER_EXIST_IN_DATABASE
            assert.strictEqual(condition, true)
        }
    })

})



describe('Testing de users.mongo.dao METODO GET', function(){
    
    before(function(){
        this.usersDao = new UsersMongoDao()
    })   

    it('EL metodo get() debe devolver un array vacio o si la coleccion esta vacio,de lo contrario,un array de UserDTO con todos los usuarios existentes en la base de datos.', 
        async function(){
            const result = await this.usersDao.get()
            const condition1 = Array.isArray(result) && allELementsAreInstanceOf(result,UserDTO)
            const condition2 = Array.isArray(result) && result.length == 0
            assert.strictEqual(condition1 || condition2, true)
        }
    )


    it('Prueba de pasar queryObjects con userEmail. Si encuentra el user debe devolver un dto, de lo contrario un array vacio.', 
        async function(){
            const result = await this.usersDao.get({userEmail:'unusuario@gmail.com'})
            const condition1 = Array.isArray(result) && allELementsAreInstanceOf(result,UserDTO)
            const condition2 = Array.isArray(result) && result.length == 0
            assert.strictEqual(condition1 || condition2, true)
        }
    )

    it('Prueba de pasar queryObjects con userCartId. Si encuentra el user debe devolver un dto, de lo contrario un array vacio.', 
        async function(){
            const result = await this.usersDao.get({userCartId:'52535342'})
            const condition1 = Array.isArray(result) && allELementsAreInstanceOf(result,UserDTO)
            const condition2 = Array.isArray(result) && result.length == 0
            assert.strictEqual(condition1 || condition2, true)
        }
    )


    it('Prueba de pasar queryObjects con userId. Si encuentra el user debe devolver un dto, de lo contrario un array vacio.', 

        async function(){
            const result = await this.usersDao.get({userId:'66895e96991387f0f3871e8f'})
            const condition1 = Array.isArray(result) && allELementsAreInstanceOf(result,UserDTO)
            const condition2 = Array.isArray(result) && result.length == 0
            assert.strictEqual(condition1 || condition2, true)
        }
    )

    it('Prueba de pasar queryObjects no correcto (O sa un queryObject con mas de una propiedad.). Si encuentra el user debe devolver un dto, de lo contrario un array vacio.', 
        
        async function(){
            try{
                const result = await this.usersDao.get({userId:'66895e96991387f0f3871e8f',userEmail:'unemail@gmail.com'})
                if (result) assert.fail('Fallo porue devolvio resultado, pero tenia que devolver error.')
            }catch(error){
                const condition = error instanceof UsersServiceError && error.code == UsersServiceError.GET_ERROR
            assert.strictEqual(condition, true)
            }
        }
    )

})
    

describe