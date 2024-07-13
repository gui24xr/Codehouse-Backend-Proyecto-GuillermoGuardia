import { ProductDTO } from "../src/dto/products.dto.js";
import { MongoProductsDAO } from "../src/dao/mongo/products.mongo.dao.js";
import { ProductsServiceError } from "../src/services/errors.service.js";

import mongoose from "mongoose";





let productsArray1 = [
    { title: 'Producto 1', description: 'Descripción Producto 1', price: 24, category: 'electronica', code: 'codigoprod01', stock: 85, owner: 'pepeito' },
    { title: 'Producto 2', description: 'Descripción Producto 2', price: 49.99, category: 'informatica', code: 'codigoprod02', stock: 50 },
    { title: 'Producto 3', description: 'Descripción Producto 3', price: 12.5, category: 'alimentacion', code: 'codigoprod03', stock: 100, owner: 'lucía' },
    { title: 'Producto 4', description: 'Descripción Producto 4', price: 89.99, category: 'moda', code: 'codigoprod04', stock: 0 },
    { title: 'Producto 5', description: 'Descripción Producto 5', price: 34.99, category: 'hogar', code: 'codigoprod05', stock: 75, owner: 'maría' },
    { title: 'Producto 6', description: 'Descripción Producto 6', price: 19.99, category: 'electronica', code: 'codigoprod06', stock: 60 },
    { title: 'Producto 7', description: 'Descripción Producto 7', price: 160, category: 'moda', code: 'codigoprod07', stock: 25, owner: 'juanito' },
    { title: 'Producto 8', description: 'Descripción Producto 8', price: 9.99, category: 'electronica', code: 'codigoprod08', stock: 120 },
    { title: 'Producto 9', description: 'Descripción Producto 9', price: 64.5, category: 'hogar', code: 'codigoprod09', stock: 40, owner: 'carlitos' },
    { title: 'Producto 10', description: 'Descripción Producto 10', price: 29.99, category: 'electronica', code: 'codigoprod10', stock: 90 },
    { title: 'Producto 11', description: 'Descripción Producto 11', price: 15.75, category: 'alimentacion', code: 'codigoprod11', stock: 15 },
    { title: 'Producto 12', description: 'Descripción Producto 12', price: 39.99, category: 'hogar', code: 'codigoprod12', stock: 55, owner: 'ana' },
    { title: 'Producto 13', description: 'Descripción Producto 13', price: 79.99, category: 'electronica', code: 'codigoprod13', stock: 10 },
    { title: 'Producto 14', description: 'Descripción Producto 14', price: 49.5, category: 'moda', code: 'codigoprod14', stock: 0, owner: 'pablo' },
    { title: 'Producto 15', description: 'Descripción Producto 15', price: 29.99, category: 'electronica', code: 'codigoprod15', stock: 80 },
    { title: 'Producto 16', description: 'Descripción Producto 16', price: 69.99, category: 'hogar', code: 'codigoprod16', stock: 30 },
    { title: 'Producto 17', description: 'Descripción Producto 17', price: 99.99, category: 'moda', code: 'codigoprod17', stock: 5 },
    { title: 'Producto 18', description: 'Descripción Producto 18', price: 19.99, category: 'electronica', code: 'codigoprod18', stock: 70, owner: 'roberto' },
    { title: 'Producto 19', description: 'Descripción Producto 19', price: 44.99, category: 'hogar', code: 'codigoprod19', stock: 25 },
    { title: 'Producto 20', description: 'Descripción Producto 20', price: 149.99, category: 'moda', code: 'codigoprod20', stock: 0 },
    { title: 'Producto 21', description: 'Descripción Producto 21', price: 9.99, category: 'electronica', code: 'codigoprod21', stock: 100 },
    { title: 'Producto 22', description: 'Descripción Producto 22', price: 59.99, category: 'hogar', code: 'codigoprod22', stock: 35, owner: 'luisa' },
    { title: 'Producto 23', description: 'Descripción Producto 23', price: 34.5, category: 'electronica', code: 'codigoprod23', stock: 50 },
    { title: 'Producto 24', description: 'Descripción Producto 24', price: 129.99, category: 'moda', code: 'codigoprod24', stock: 2 },
    { title: 'Producto 25', description: 'Descripción Producto 25', price: 19.99, category: 'electronica', code: 'codigoprod25', stock: 45, owner: 'juana' }
]

//10 elementos category:cascos, stock>100, price>1000, owner.adriancito
let productsArray2 = [
    { title: 'Producto 26', description: 'Descripción Producto 26', price: 1200, category: 'cascos', code: 'codigoprod26', stock: 150, owner: 'adriancito' },
    { title: 'Producto 27', description: 'Descripción Producto 27', price: 1300, category: 'cascos', code: 'codigoprod27', stock: 200, owner: 'adriancito' },
    { title: 'Producto 28', description: 'Descripción Producto 28', price: 1400, category: 'cascos', code: 'codigoprod28', stock: 180, owner: 'adriancito' },
    { title: 'Producto 29', description: 'Descripción Producto 29', price: 1100, category: 'cascos', code: 'codigoprod29', stock: 220, owner: 'adriancito' },
    { title: 'Producto 30', description: 'Descripción Producto 30', price: 1500, category: 'cascos', code: 'codigoprod30', stock: 300, owner: 'adriancito' },
    { title: 'Producto 31', description: 'Descripción Producto 31', price: 1600, category: 'cascos', code: 'codigoprod31', stock: 250, owner: 'adriancito' },
    { title: 'Producto 32', description: 'Descripción Producto 32', price: 1700, category: 'cascos', code: 'codigoprod32', stock: 280, owner: 'adriancito' },
    { title: 'Producto 33', description: 'Descripción Producto 33', price: 1800, category: 'cascos', code: 'codigoprod33', stock: 260, owner: 'adriancito' },
    { title: 'Producto 34', description: 'Descripción Producto 34', price: 1900, category: 'cascos', code: 'codigoprod34', stock: 240, owner: 'adriancito' },
    { title: 'Producto 35', description: 'Descripción Producto 35', price: 2000, category: 'cascos', code: 'codigoprod35', stock: 230, owner: 'adriancito' }
];

let productsArray3 = [
    { title: 'Producto 36', description: 'Descripción Producto 36', price: 3500, category: 'telefonos', code: 'codigoprod36', stock: 150, owner: 'menganito' },
    { title: 'Producto 37', description: 'Descripción Producto 37', price: 3600, category: 'telefonos', code: 'codigoprod37', stock: 200, owner: 'menganito' },
    { title: 'Producto 38', description: 'Descripción Producto 38', price: 3700, category: 'telefonos', code: 'codigoprod38', stock: 180, owner: 'menganito' },
    { title: 'Producto 39', description: 'Descripción Producto 39', price: 3100, category: 'telefonos', code: 'codigoprod39', stock: 220, owner: 'menganito' },
    { title: 'Producto 40', description: 'Descripción Producto 40', price: 3800, category: 'telefonos', code: 'codigoprod40', stock: 300, owner: 'menganito' },
    { title: 'Producto 41', description: 'Descripción Producto 41', price: 3900, category: 'telefonos', code: 'codigoprod41', stock: 250, owner: 'menganito' },
    { title: 'Producto 42', description: 'Descripción Producto 42', price: 4100, category: 'telefonos', code: 'codigoprod42', stock: 280, owner: 'menganito' },
    { title: 'Producto 43', description: 'Descripción Producto 43', price: 4200, category: 'telefonos', code: 'codigoprod43', stock: 260, owner: 'menganito' },
    { title: 'Producto 44', description: 'Descripción Producto 44', price: 4300, category: 'telefonos', code: 'codigoprod44', stock: 240, owner: 'menganito' },
    { title: 'Producto 45', description: 'Descripción Producto 45', price: 4400, category: 'telefonos', code: 'codigoprod45', stock: 230, owner: 'menganito' }
];


const connectResult = await mongoose.connect('mongodb+srv://gui24xrdev:2485javiersolis@cluster0.a6zgcio.mongodb.net/ecommerce2?retryWrites=true&w=majority&appName=Cluster0')
if (connectResult) {
    console.log('Conexión exitosa con MongoDB!');
} else {
    console.error('Error al conectar con MongoDB:', connectResult);
}

//Limpio la base de datos al comenzar.
await mongoose.connection.collections.products.drop()
//Creo una instancia 
const productsDAO = new MongoProductsDAO()
//Creo los array que usare para almacenar datos.
let createResultArray
let getResultArray
let searchResultObject
let deleteResultArray

//Le creo 25 productos del productsArray1.
createResultArray = await productsDAO.createProducts(productsArray1)
console.log('RESULTADOS CREATE 25 PRODUCTOS: ',createResultArray)
console.log('Creo 25 elementos y todos son productsdto? ',createResultArray.length == 25 ,createResultArray.every(item => item instanceof ProductDTO ))
 
//Le creo 10 productos del productsArray1.
createResultArray = await productsDAO.createProducts(productsArray2)
console.log('RESULTADOS CREATE 10 PRODUCTOS: ',createResultArray)
console.log('Creo 10 elementos y todos son productsdto? ',createResultArray.length == 10 ,createResultArray.every(item => item instanceof ProductDTO ))

//Le creo 10 productos del productsArray1.
createResultArray = await productsDAO.createProducts(productsArray3)
console.log('RESULTADOS CREATE 10 PRODUCTOS: ',createResultArray)
console.log('Creo 10 elementos y todos son productsdto? ',createResultArray.length == 10 ,createResultArray.every(item => item instanceof ProductDTO ))
 

//Ahora hago get con {} y debo obtener 35 elementos.
getResultArray = await productsDAO.get({})
console.log('RESULTADOS GET {}: ',getResultArray)
console.log('Retorna 35 elementos y todos son productsdto? ',getResultArray.length == 35 ,getResultArray.every(item => item instanceof ProductDTO ))

//Ahora hago get con {owner:adriancito} y debo obtener 10 elementos.
getResultArray = await productsDAO.get({owner:'adriancito'})
console.log('RESULTADOS GET {owner.adrancito}: ',getResultArray)
console.log('Retorna 10 elementos y todos son productsdto? ',getResultArray.length == 10 ,getResultArray.every(item => item instanceof ProductDTO ))

//Ahora hago get con {category:'electronica'} y debo obtener tantos elementos con esa categoria.
getResultArray = await productsDAO.get({category:'electronica'})
console.log('RESULTADOS GET {owner.adrancito}: ',getResultArray)
console.log(`Retorna ${productsArray1.filter(item=>item.category == 'electronica').length} elementos y todos son productsdto? `,getResultArray.length == productsArray1.filter(item=>item.category == 'electronica').length ,getResultArray.every(item => item instanceof ProductDTO ))

//Ahora hago get con {category:'electronica',owner:'adriancito'} y debo obtener un array vacio
getResultArray = await productsDAO.get({category:'electronica',owner:'adriancito'})
console.log('RESULTADOS GET {category:"electronica",owner:"adriancito"}}: ',getResultArray)
console.log(`Retorna un array vacio `,getResultArray.length == 0)


//Ahora probamos search
searchResultObject = await productsDAO.search({})
console.log('RESULTADOS SEARCH {}: ',searchResultObject)
console.log('Retorna un objeto que tiene la prop productsQueryList.totalProducts == 35 ', searchResultObject.totalProducts == 35,'\n',
            'Pero limit en 10 xq no se paso limit entonces debe ser 10...', searchResultObject.limit == 10)

//Ahora probamos search
searchResultObject = await productsDAO.search({limit:20,owner:'adriancito',category:'alimentacion'})
console.log('RESULTADOS SEARCH : ',searchResultObject)
console.log('Debe devolvelver cero ya que no hay coincidencias. De todos modos limit debe ser 20. ', searchResultObject.totalProducts == 0,'\n',
            'Pero limit en 10 xq no se paso limit entonces debe ser 10...', searchResultObject.limit == 20)

//Ahora probamos search
searchResultObject = await productsDAO.search({orderField:'price'})
console.log('RESULTADOS SEARCH {}: ',searchResultObject)
console.log('Retorna un objeto que tiene la prop productsQueryList.totalProducts == 35 ', searchResultObject.totalProducts == 10,'\n',
            'Pero limit en 10 xq no se paso limit entonces debe ser 10...', searchResultObject.limit == 10)

//Ahora probamos search sin ordenamiento tiene que devovler 10 x fecha de creacion ascendente.
searchResultObject = await productsDAO.search({orderBy:1})
console.log('RESULTADOS SEARCH {}: ',searchResultObject)
console.log('Retorna un objeto que tiene la prop productsQueryList.totalProducts == 35 ', searchResultObject.totalProducts == 10,'\n',
            'Pero limit en 10 xq no se paso limit entonces debe ser 10...', searchResultObject.limit == 10)


//Probamos distinct y codesforOwnerpor selectedField
searchResultObject = await productsDAO.getDistinct('category')
console.log('Distinct por categoria: ',searchResultObject)
searchResultObject = await productsDAO.getDistinct('owner')
console.log('Distinct por owner: ',searchResultObject)
searchResultObject = await productsDAO.getDistinct('price')
console.log('Distinct por price: ',searchResultObject)
searchResultObject = await productsDAO.getCodesListForOwner('adriancito2')
console.log('Distinct por price: ',searchResultObject)

//Ahora probamos search sin ordenamiento tiene que devovler 10 x fecha de creacion ascendente.
searchResultObject = await productsDAO.search({purchasesCountRange:{min: 0,max: 1000}})
//console.log('RESULTADOS SEARCH con purchaseRange: ',searchResultObject)
//console.log('Retorna 35 xq todos ahora tienen cero el purchaseCoount,pero limit es 10. ', searchResultObject.totalProducts == 35,'\n',
       //     'Pero limit en 10 xq no se paso limit entonces debe ser 10...', searchResultObject.limit == 10)


//Ahora probamos search sin ordenamiento tiene que devovler 10 x fecha de creacion ascendente.
searchResultObject = await productsDAO.search({priceRange:{min:155,max: 2000}})
console.log('RESULTADOS SEARCH con purchaseRange: ',searchResultObject)
//console.log('Retorna 10 xq todos ahora tienen cero el purchaseCoount,pero limit es 10. ', searchResultObject.totalProducts == 35,'\n',
      //      'Pero limit en 10 xq no se paso limit entonces debe ser 10...', searchResultObject.limit == 10)


      //Borramos por query los 10 productos de meganito o sea los de mayor 3000
deleteResultArray = await productsDAO.deleteByQuery({priceRange:{min:3000}})
console.log('RESULTADOS DELETE BY QUERY: ', deleteResultArray, 'Borrados: ', deleteResultArray.length)

//Probamos deleteBylist. Obtengo los id de adriancito y los mando a borrar
const productsListAdriancito = await productsDAO.get({owner:'adriancito'})
const productsOfAdriancito = productsListAdriancito.map ( item => (item.productId))
//console.log(productsOfAdriancito)
deleteResultArray = await productsDAO.deleteByList(productsOfAdriancito)
console.log(deleteResultArray)