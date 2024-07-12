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

describe('Probando get products',function(){
        
    before(function(){
            this.productsDAO = new MongoProductsDAO()
        })


    it('Prueba get con {}',async function(){
        const unValor = 1

        try{
            const result = await this.productsDAO.get({
                //productId : '664504dc6cccb495261b2fcd',
                //status :false,
                //code : "lmqn5962"
                //owner: 'admin',
                //category: 'cascos'
              })
                
            //console.log('Resultado: ', result)
            //console.log('Cantidad: ', result.length)
            assert.strictEqual(unValor == 1, true)

        }catch(error){
            console.log(error)
        }

    })

    it('Probar search para paginate ', 
        async function(){
            const unValor = 1
    
            try{
                const result = await this.productsDAO.search({
                    //productId : '664504dc6cccb495261b2fcd',
                    //status :true,
                    //code : "lmqn5962"
                    //owner: 'admin',
                    category: 'cascos',
                    limit: 40
                  })
                    
                //console.log('Resultado: ', result)
                //console.log('Cantidad: ', result.length)
                assert.strictEqual(unValor == 1, true)
    
            }catch(error){
                console.log(error)
            }
    
        }
    )

    it('Probar distinct',async function(){
        const unValor = 1
        //Podria usar lowner para obtener por usrs, etc
        const result = await this.productsDAO.getDistinct('category')
        console.log('Resultado: ', result)

        assert.strictEqual(unValor ==1,true)
    })

    it('prueba de creacion',async function(){
        const unValor = 1
        //Podria usar lowner para obtener por usrs, etc

        const productsList =[
            {title:'Producto 1', description: 'Descripcion Producto 1', price: 24, category: 'Categoria A',
                code: 'codigoprod01', stock:85, owner:'pepeito'
            },
            {title:'Producto 2', description: 'Descripcion Producto 2', price: 24, category: 'Categoria B',
                code: 'codigoprod2', stock:0, owner:'pepeito'
            },
            {title:'Producto 3',  price: 24, category: 'Categoria A',
                code: 'codigoprod3', stock:85, owner:'pepeito'
            }
        ]
        const result = await this.productsDAO.createProducts(productsList)
        console.log('Resultado: ', result)

        assert.strictEqual(unValor ==1,true)
    })


    it('prueba de update',async function(){
        const unValor = 1
        //Podria usar lowner para obtener por usrs, etc

        const updateProductsList =[
            {
                productId: '669006295797512a8efc7a41', 
                updateInfo: {
                    newTitle:'P24A', 
                    newBrand:'M24A',
                    newStock:2485
                }
            },
            {
                productId: '669006295797512a8efc7a42', 
                updateInfo: {
                    newTitle:'P25A', 
                    newBrand:'M25A',
                    newStock:285
                }
            },
        
        ]
        const result = await this.productsDAO.updateProductsListById(updateProductsList)
        console.log('Resultado: ', result)

        assert.strictEqual(unValor ==1,true)
    })

    
    it('prueba de deleteByQuery',async function(){
        const unValor = 1
        //Podria usar lowner para obtener por usrs, etc

        const deleteQuery = { 
            productId: '66913a858673a7abd8e88bb6'
        }
      

        try{

        }catch(error){
            console.log(error)
        }
        const result = await this.productsDAO.deleteByQuery(deleteQuery)
        console.log('Resultado deleteByQuery: ', result)

        assert.strictEqual(unValor ==1,true)
    })
    }

    

    
    

)