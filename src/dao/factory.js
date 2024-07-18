export let CartsDAO
export let ProductsDAO 
export let UsersDAO
export let ExchangePointsDAO
export let PurchasesDAO
export let MessagesDAO
export let TicketsDAO


switch (process.env.database){
    case 'mongo':
        const {default:ProductsMongoDAO} = await import('./mongo/products.mongo.dao.js')
        const {default:CartsMongoDAO} = await import('./mongo/carts.mongo.dao.js')
        const {default:UsersMongoDAO} = await import('./mongo/users.mongo.dao.js')
        const {default:TicketsMongoDAO} = await import('./mongo/tickets.mongo.dao.js')
        const {default:ExchangePointsMongoDAO} = await import('./mongo/exchangepoints.mongo.dao.js')

        //Como yo quiero que se llame igual siempre al importar se lo asgino a CartsDao
        //O sea en cartsDao va a vivir la clase CartsMongoDAO
        ProductsDAO = ProductsMongoDAO
        CartsDAO = CartsMongoDAO
        UsersDAO = UsersMongoDAO
        ExchangePointsDAO = ExchangePointsMongoDAO
        TicketsDAO = TicketsMongoDAO
    break
    case 'sequelize':
        console.log('Entro sequelize')

    break

    case 'firebase':
        console.log('Entro firebase')
    break
    default:
        throw new Error(`Unsupported database: ${database}`);
}



/*
        //SI necesitamos cargar modulos en tiempo de ejecucioon ejemplo en este caso cambiar bases de datos
        y tuviesemos que cargar modulos de manera asincrona.


        IMPORTANTE:

        distinguir entre la declaración import y la función import().

        Declaración import: Esta es una forma estándar y síncrona de importar módulos en JavaScript. 
        Se utiliza para cargar módulos de manera síncrona al comienzo de un archivo de módulo o dentro de una función, 
        pero siempre de manera síncrona.La declaración import no devuelve una promesa y se ejecuta de forma síncrona, 
        bloqueando la ejecución del código hasta que el módulo se haya cargado y evaluado.

        : Esta es una función dinámica y asíncrona que se utiliza para cargar módulos de manera asíncrona en tiempo de 
        ejecución. La función import() devuelve una promesa que se resuelve con el módulo cargado una vez que esté 
        disponible. Esto permite cargar módulos de manera dinámica según sea necesario durante la ejecución del programa.
        
        
        La funcion import('string modulo') devuelve una promesa que cuando se resuelve
        nos da un objeto asi:

        {
            default: funcionExportadaPorDefault
            myFunction1: funcion1
            myFunction2: funcion2
            .
            .
            .
            myFunctionN: funcionN
        }

        O sea es un objeto comun quue tiene como propiedades en default la unica funcion/clase/variable que 
        es permitido exportar por default y el resto de las propiedades tienen nel nombre de las funcion/clase/variable
        que tienen export. Ejempelo

        en este caso en nuestra clase tenemos: 'export default class CartsMongoDAO'
        
        por ejemplo este modulo: mimodulo.js

        ---------------------------------
        export const unaVariable = 24 
        export class clasePepito{}
        export default class CartsMongoDAO{}
        ---------------------------------
        si hacemos: 
        const objetoModulo = await import('mimodulo.js')
        nos devuelve este objeto: 
         {
            clasePepito: [class clasePepito],
            default: [class CartsMongoDAO],
            unaVariable: 24
        }

        y en el caso de la sintaxis de arriba
        const {default:CartsMongoDAO} = await import('./mongo/carts.mongo.dao.js')
        ya usamos deconttructuracion de objeto y renombramos a lo que exportamos por default. De esa manera accedemos luego a la clase.
*/