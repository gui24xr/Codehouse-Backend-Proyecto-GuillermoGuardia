import express from 'express'
import { generateProducts } from '../utils/faker.js'

export const router = express.Router()

router.get('/mockingproducts',(req,res)=>{

    
    const productsList = generateProducts(100)
    res.json(productsList)
})

