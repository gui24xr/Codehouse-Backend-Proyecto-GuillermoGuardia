
//PARA HACER PRUEAS FUERA DE LAS CONSIGNAS



import express from 'express'
import fs from 'fs'

import { MongoProductsDAO } from '../dao/mongo/products.mongo.dao.js'

import { CheckoutService } from '../services/checkout/checkout-service.js'

import { TicketsRepositories } from '../repositories/ticket.repositories.js'
import { ProductRepository } from '../repositories/products.repositories.js'
import { MessagesService } from '../services/messages/messages-service.js'
import {  authMiddleware } from '../middlewares/authTokenMiddlewares.js'

import { CartsService } from '../services/carts.service.js'
import { UsersService } from '../services/users.service.js'
import UsersMongoDao from '../dao/mongo/users.mongo.dao.js'
import { UsersRepository as NuevoUsersRepository } from '../repositories/users-repository.js'
import DeliveryPointsMongoDAO from '../dao/mongo/deliveypoints.mongo.dao.js'
const mongoProductsDAO = new MongoProductsDAO()

const checkoutService = new CheckoutService()

const ticketRepositories = new TicketsRepositories
const productsRepository = new ProductRepository()

const cartsService = new CartsService()
const usersService = new UsersService()

export const router = express.Router()

router.get('/prueba',async(req,res)=>{

    res.send('pruebas')
})



router.get('/authmiddleware',authMiddleware,(req,res)=>{
    res.send(res.locals.sessionData)
})


router.get('/changeproductstatus/:id',async(req,res)=>{
    const {id} = req.params

    try{
        const operationResult = await mongoProductsDAO.changeProductStatus(id)
        console.log('Operation result: ',operationResult)
        res.json(operationResult)
    }catch(error){
        console.log(error)
    }
})


router.get('/checkout/:email',async(req,res)=>{
    try{
        const searchedUser = await userRepositories.getUser(req.params.email)
        if (!searchedUser){
            return 'No existe user...'
        }
      
        const checkoutResult = await checkoutService.checkOutCart(searchedUser.cart)
        res.json(checkoutResult)
    }catch(error){
        throw new Error(`Error al intentar checkout pruebas`)
    }

})

router.get('/searchusers',async(req,res)=>{

    //const {filter} = req.query
    //console.log('Filter en endpoint: ', filter)
    const filter={'cart':'663120ceda09d7ad646a3ff6'}
    try{
        const searchResult = await userRepositories.getUsers(filter)
        res.json(searchResult)
    }catch(error){
        throw new Error('Error en prueba searchusers...')
    }
    
})

router.get('/gettickets',async(req,res)=>{

    try{
        //const searchResult = await ticketRepositories.getTickets({purchaser:'663120ceda09d7ad646a4000'})
        const searchResult = await ticketRepositories.getTicketsByPurchaser('663120ceda09d7ad646a4000')
        //console.log(searchResult)
        res.json(searchResult)
    }catch(error){
        throw new Error('Error en prueba gettickets...')
    }
})

router.get('/getcategories',async(req,res)=>{

    try{
        //const searchResult = await ticketRepositories.getTickets({purchaser:'663120ceda09d7ad646a4000'})
        const searchResult = await productsRepository.getProductsCategoriesList()
        console.log(searchResult)
        res.json(searchResult)
    }catch(error){
        throw new Error('Error en prueba gettickets...')
    }
})


router.get('/paginate',async (req,res)=>{
    const limit=24
    const page=2
    const sort = 1
    const query = {}
    const pagination = await mongoProductsDAO.getProductsPaginate(limit,page,sort,query)


    fs.promises.writeFile('pagination.json',JSON.stringify(pagination,null,1))
    res.json(pagination);
})


router.get('/wtsp',(req,res)=>{

    MessagesService.sendWtsp('Hola aqui enviando un mensaje...','+5491159149165')
    res.send('Enviando')
})

router.get('/mail',(req,res)=>{
    MessagesService.sendMail('<p>Enviando eMail Gui</p>','guillermoxr24@gmail.com','Un email')
	res.send('Enviando')
})

router.get('/log',(req,res)=>{
    console.log('ALgo llego desde afuera !')
	res.send('Recibido')
})

//---PRUEBAS DE CAPAS CART-------------///
router.post('/nuevocart/create',async (req,res)=>{
  const nuevoCart = await cartsService.createCart()
  res.send(nuevoCart)
})

router.get('/nuevocart/get/:id',async (req,res)=>{
  const {id:cartId}= req.params
  const myCart = await cartsService.getCartById(cartId)
  res.send(myCart)
})


router.get('/nuevocart/getproducts/:id',async (req,res)=>{
    const {id:cartId}= req.params
    const products = await cartsService.getProductsInCart(cartId)
    res.send(products)
})

router.get('/nuevocart/getcounts/:id/:pid',async (req,res)=>{
    const {id:cartId,pid:productId}= req.params
    const quantity = await cartsService.getProductQuantityInCart(cartId,productId)
    const count = await cartsService.countProductsInCart(cartId)
    const amount = await cartsService.cartAmount(cartId)

    console.log(quantity,count,amount)
    res.json({quantity:quantity,count:count,amount:amount})
  })
  
 router.post('/nuevocart/addproduct/:id/:pid',async (req,res)=>{
    const {id:cartId,pid:productId}= req.params
    const result = await cartsService.addProductInCart(cartId,productId)
    res.send(result)
})

router.post('/nuevocart/delete/:id/:pid',async (req,res)=>{
    const {id:cartId,pid:productId}= req.params
    const result = await cartsService.deleteProductFromCart(cartId,productId)
    res.send(result)
})



router.post('/nuevocart/clear/:id',async (req,res)=>{
    const {id:cartId}= req.params
    const result = await cartsService.clearCart(cartId)
    res.send(result)
})

router.post('/nuevouser/:username',async (req,res)=>{
    const {username} = req.params
    
    //const result = await usersService.createUserWithCart('nombre','apellido',`${username}@gmail.com`,'123456',23,'user')
    const result = await usersService.createUser('nombre','apellido',`${username}@gmail.com`,'123456',23,'admin')
    res.send(result)

})

router.post('/loginuser/:username/:password',async (req,res)=>{
    const {username,password} = req.params
    
    //const result = await usersService.createUserWithCart('nombre','apellido',`${username}@gmail.com`,'123456',23,'user')
    const result = await usersService.authenticateUser(`${username}@gmail.com`,password)
    res.send(result)

})

router.post('/updaterole/:username/:role',async (req,res)=>{
    const {username,role} = req.params
    
    //const result = await usersService.createUserWithCart('nombre','apellido',`${username}@gmail.com`,'123456',23,'user')
    const result = await usersService.changeUserRole(`${username}@gmail.com`,role)
    res.send(result)

})

router.post('/mongouserdao/:username',async(req,res)=>{
    const {username} = req.params
    const usersMongoDao = new UsersMongoDao()

    const email = `${username}@gemail.com`
    const password = 123456
    const firstName = 'un nombre'
    const lastName = 'un apellido'
    const age = 22
    const role = 'user'
    const cartId = '666765b6718b28823f4c05db'

    const resultCreate = await usersMongoDao.createUser(email,password,firstName,lastName,role,age,cartId)
    console.log('Create: ',resultCreate)
    const resultGetByEmail = await usersMongoDao.getUserByEmail(email)
    console.log('ByEmail: ',resultGetByEmail)
    const resultGetById = await usersMongoDao.getUserByEmail(email)
    console.log('ById: ',resultGetById)

    //Obtuve un DTO, lo modifico con sus set.
    resultGetByEmail.setLastConnection(new Date())
    console.log('Modificado en DTO: ', resultGetByEmail)
    let updatedResult = await usersMongoDao.updateUser(resultGetByEmail)
    console.log('Updated: ', updatedResult)

    resultGetByEmail.setRole('admin')
    console.log('Modificado en DTO: ', resultGetByEmail)
    updatedResult = await usersMongoDao.updateUser(resultGetByEmail)
    console.log('Updated role: ', updatedResult)

    resultGetByEmail.addDocument('avatar','urlavatar')
    resultGetByEmail.addDocument('avatar2','urlavatar2')
    console.log('Modificado en DTO: ', resultGetByEmail)
    updatedResult = await usersMongoDao.updateUser(resultGetByEmail)
    console.log('Updated doc: ', updatedResult)

    resultGetByEmail.setPassword('242424')
    console.log('Modificado en DTO paswor: ', resultGetByEmail)
    updatedResult = await usersMongoDao.updateUser(resultGetByEmail)
    console.log('Updated passwc: ', updatedResult)

    const deleteResult = await usersMongoDao.deleteUserByEmail(email)
    console.log('Deleted: ', deleteResult)
    res.send('Todo OK')

})

router.post('/usersrepository/:userid',async(req,res)=>{
     const {userid:userId}= req.params
     const usersRepository = new NuevoUsersRepository()
     const myUser = await usersRepository.getUserById(userId)
     await usersRepository.updateLastConnection(userId,new Date())
     await usersRepository.setPassword(userId,'11122222')
     await usersRepository.setRole(userId,'user')
     await usersRepository.setCart(userId,'66676603aea7e1f046531eee')
     await usersRepository.addDocument(userId,'avatar','refavatar')
     const result = await usersRepository.getUserById(userId)
   
    res.json({Original: myUser, modificado: result})
})

router.get('/mongodaouser/:email',async(req,res)=>{
    const {email} = req.params
    const mongouserdao = new UsersMongoDao()
    const result = await mongouserdao.getUserByEmail(email)
    
    res.send(result)
})

router.post('/usersincart/:email',async(req,res)=>{
    const {email} = req.params
    const mongouserdao = new UsersMongoDao()
    const result = await mongouserdao.createUser(email,'123456','gui','ller','user',44,null)
    
    res.send(result)
})


router.get('/cartcheckoutlist/:cid',async(req,res)=>{
    const {cid:cartId} = req.params
    const result = await cartsService.checkoutCartById(cartId)
    res.send(result)
})

router.post('/delivery/crear',async(req,res)=>{
    const deliveryPointsMongoDao = new DeliveryPointsMongoDAO()
    const result = await deliveryPointsMongoDao.createDeliveryPoint({})
    res.send(result)
})

router.post('/delivery/crear2',async(req,res)=>{
    const deliveryPointsMongoDao = new DeliveryPointsMongoDAO()
    const result = await deliveryPointsMongoDao.createDeliveryPoint({})
    res.send(result)
})

