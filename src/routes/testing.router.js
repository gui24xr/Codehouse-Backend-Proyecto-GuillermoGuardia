import express from 'express'
import { generateProducts } from '../utils/faker.js'
import { UsersController } from '../controllers/users.controller.js'


export const router = express.Router()




router.get('/mockingproducts',(req,res)=>{
    const productsList = generateProducts(100)
    res.json(productsList)
})

router.get('/loggertest',(req,res)=>{
    //Accedemos al logger a travez de la propiedad res...
   // req.logger.error(`Se ingreso a logger test y se probo logger.error  ${new Date().toLocaleTimeString()}`)
  
   req.logger.error('Una info')
     res.status(200).send('Para la prueba veremos log en consola por la accion del middleware addLogger y tambien a travez de este endpoint hicimos logger.error() para que en el archivo errors.log se genere un log...')
    })


