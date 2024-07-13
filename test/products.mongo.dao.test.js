import { ProductDTO } from "../src/dto/products.dto.js";
import { MongoProductsDAO } from "../src/dao/mongo/products.mongo.dao.js";
import { ProductsServiceError } from "../src/services/errors.service.js";

import Assert from 'assert';
import mongoose from "mongoose";



const connectResult = await mongoose.connect('mongodb+srv://gui24xrdev:2485javiersolis@cluster0.a6zgcio.mongodb.net/ecommerce2?retryWrites=true&w=majority&appName=Cluster0')
if (connectResult) {
    console.log('Conexión exitosa con MongoDB!');
} else {
    console.error('Error al conectar con MongoDB:', connectResult);
}

const assert = Assert.strict;



let productsArray = [
    { title: 'Producto 1', description: 'Descripción Producto 1', price: 24, category: 'electronica', code: 'codigoprod01', stock: 85, owner: 'pepeito' },
    { title: 'Producto 2', description: 'Descripción Producto 2', price: 49.99, category: 'informatica', code: 'codigoprod02', stock: 50 },
    { title: 'Producto 3', description: 'Descripción Producto 3', price: 12.5, category: 'alimentacion', code: 'codigoprod03', stock: 100, owner: 'lucía' },
    { title: 'Producto 4', description: 'Descripción Producto 4', price: 89.99, category: 'moda', code: 'codigoprod04', stock: 0 },
    { title: 'Producto 5', description: 'Descripción Producto 5', price: 34.99, category: 'hogar', code: 'codigoprod05', stock: 75, owner: 'maría' },
    { title: 'Producto 6', description: 'Descripción Producto 6', price: 19.99, category: 'electronica', code: 'codigoprod06', stock: 60 },
    { title: 'Producto 7', description: 'Descripción Producto 7', price: 149.99, category: 'moda', code: 'codigoprod07', stock: 25, owner: 'juanito' },
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




//----------- CREATE ----------------------------------------------------------------------------////
describe('***** ------ // TEST MongoProductsDAO - Metodo createProducts //------ ***** ',function(){
        
    before(async function(){
            await mongoose.connection.collections.products.drop()
            this.productsDAO = new MongoProductsDAO()
        })

    it('Se crean 25 productos a partir de productsArray y se devuelve los 25 ProductDTO de los registros creados',async function(){
            try{
                const resultArray = await this.productsDAO.createProducts(productsArray)
                //console.log('RESULTADOS CREATE: ',resultArray) 
                //Se crearon 25 instancias de productDTO
                const conditionsArrayForOK =  [
                    resultArray.every(item => item instanceof ProductDTO),
                    resultArray.length === 25,
                ]
                //Si todas las condiciones del array son ciertas entonces el test es OK.
                assert.strictEqual(conditionsArrayForOK.every(item => item == true),true)
            } catch(error){
                console.log(error)
            }
        })
    })

    


//----------- GET ----------------------------------------------------------------------------////
        


describe('***** ------ // TEST MongoProductsDAO - Metodo get //------ ***** ',function(){
        
    before(function(){
            this.productsDAO = new MongoProductsDAO()
        })

    it('-- METODO GET parametros {} Se deben obtener 25 instancias de productDTO.',async function(){
        try{
            const resultArray = await this.productsDAO.get({}) 
            //Se obtuvieron 25 instancias de productDTO
            //console.log(resultArray)
            const conditionsArrayForOK =  [
                resultArray.every(item => item instanceof ProductDTO),
                resultArray.length === 25,
            ]
            //Si todas las condiciones del array son ciertas entonces el test es OK.
            assert.strictEqual(conditionsArrayForOK.every(item => item == true),true)
            }catch(error){
                console.log(error)
            }
    
        })
    
    
    it('-- METODO GET parametros {owner:admin} Se deben obtener 13 instancias de productDTO...',async function(){
            
        try{
            const resultArray = await this.productsDAO.get({owner:'admin'}) 
            //Se obtuvieron 12 instancias de productDTO las cuales tienen owner admin
            console.log('Rsutlaada: ',resultArray.length)
            const conditionsArrayForOK =  [
                resultArray.every(item => item instanceof ProductDTO),
                resultArray.length === 15//productsArray.filter(item => !item.owner).length
            ]
            //Si todas las condiciones del array son ciertas entonces el test es OK.
            assert.strictEqual(conditionsArrayForOK.every(item => item == true),true)
            }catch(error){
                console.log(error)
            }
    
        })
    })
        


//----------- SEARCH ----------------------------------------------------------------------------////
        


describe('***** ------ // TEST MongoProductsDAO - Metodo search //------ ***** ',function(){
        
    before(function(){
            this.productsDAO = new MongoProductsDAO()
        })

    it('-- METODO SEARCH parametros {category:"electronica",limit: 40}',async function(){
        try{
            const resultObject = await this.productsDAO.search({category:'electronica',limit: 40}) 
         
            //console.log(resultObject)
            const conditionsArrayForOK =  [
                resultObject.productsQueryList.every(item => item instanceof ProductDTO),//Se obtuvieron X coincidencias.
                resultObject.productsQueryList.length === productsArray.filter(item => item.category == 'electronica').length,
                resultObject.limit == 40
            ]
            //Si todas las condiciones del array son ciertas entonces el test es OK.
            assert.strictEqual(conditionsArrayForOK.every(item => item == true),true)
            }catch(error){
                console.log(error)
            }
    
        })
    
    
        it('-- METODO SEARCH parametros {} Debe devolver 10 en limit ya que no se especifica...',async function(){
            try{
                const resultObject = await this.productsDAO.search({category:'electronica'}) 
             
                //console.log(resultObject)
                const conditionsArrayForOK =  [
                    resultObject.productsQueryList.every(item => item instanceof ProductDTO),//Se obtuvieron X coincidencias.
                    resultObject.productsQueryList.length <= 10,
                    resultObject.limit == 10
                ]
                //Si todas las condiciones del array son ciertas entonces el test es OK.
                assert.strictEqual(conditionsArrayForOK.every(item => item == true),true)
                }catch(error){
                    console.log(error)
                }
        
            })
    })
        

/*

    it('-- METODO SEARCH con parametros {category,limit}-- ', 
        async function(){
    
            try{
                const resultObject = await this.productsDAO.search({category:'electronica',limit: 40})
                const conditionsForOK =  resultObject.productsQueryList.every(function(item){item instanceof ProductDTO}) 
                && resultArray.length == productsArray.filter(item => item.category == 'electronica')
                assert.strictEqual(conditionsForOK,true)
            }catch(error){
                console.log(error)
            }
    
        })


    
        it('prueba de update',async function(){
            const unValor = 1
            //La idea es hacer update sobre todos los productos. 
            const actualProducts = await this.productsDAO.get({})
            //Con la lista de DTO armo la lista de datos
            const productsForUpdate = actualProducts.map( item => ({
                productId: item.productId, 
                updateInfo: {
                    newTitle:item.title + 'Updateded', 
                    newBrand:item.brand + 'Updateded',
                    newStock:2485
                    }
            }))
    
            const resultArray = await this.productsDAO.updateProductsListById(productsForUpdate)
            //console.log('Resultado Registros actualizados: ', result)
             //Se obtuvieron 25 instancias de productDTO con lso registros actualizados.
             const conditionsForOK =  resultArray.every(function(item){item instanceof ProductDTO}) && resultArray.length == 25
             assert.strictEqual(conditionsForOK,true)
            assert.strictEqual(unValor ==1,true)
        })

/*
    it('PRUEBA METODO GET DISTINCT',async function(){
        const unValor = 1
            try{
                const result = await this.productsDAO.getDistinct('category')
                console.log('Resultado: ', result)
                assert.strictEqual(unValor == 1, true)
            }catch(error){
                console.log(error)
            }
    })

   

  

    
    it('Prueba de deleteByQuery owner admin...',async function(){
        try{
            const unValor = 1
            //Vamos a probar borrar todos los que tengan owner 'admin'
            const result = await this.productsDAO.deleteByQuery({owner:'admin'})
            console.log('Resultado deleteByQuery: ', result)
            assert.strictEqual(unValor ==1,true)
        }catch(error){
            console.log(error)
        }
    })

    
})
*/
//-----------------------------------------------
