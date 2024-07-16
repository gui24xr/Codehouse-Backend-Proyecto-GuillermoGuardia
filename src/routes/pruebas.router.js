
//PARA HACER PRUEAS FUERA DE LAS CONSIGNAS



import express from 'express'
import fs from 'fs'

import  ProductsMongoDAO  from '../dao/mongo/products.mongo.dao.js'

import { CheckoutService } from '../services/checkout/checkout-service.js'

import { TicketsRepositories } from '../repositories/ticket.repositories.js'
import { ProductsRepository } from '../repositories/products-repositories.js'
import { MessagesService } from '../services/messages.service.js'




import { UsersService } from '../services/users.service.js'
import { CartRepository } from '../repositories/carts-repository.js'
import UsersMongoDao from '../dao/mongo/users.mongo.dao.js'
import { UsersRepository } from '../repositories/users-repository.js'
import ExchangePointsMongoDAO from '../dao/mongo/exchangepoints.mongo.dao.js'
import { ExchangePointsRepository } from '../repositories/exchangepoints-repository.js'
import { ExchangePointsService } from '../services/exchangepoints.service.js'
import { exchangePointsArray } from '../../datos/exchangepointsarray.js'
//import { ProductsRepository } from '../repositories/products-repository.js'
import { ProductsService } from '../services/products.service.js'

import { CartsService } from '../services/carts.service.js'
const mongoProductsDAO = new ProductsMongoDAO()

const checkoutService = new CheckoutService()

const ticketRepositories = new TicketsRepositories


const cartsService = new CartsService()
const usersService = new UsersService()


export const router = express.Router()

router.post('/repousers',async (req,res,err)=>{

    try{
        const user1 = { email: 'usuario27@example.com', password: '123456', firstName: 'Juan', lastName: 'Pérez', age: 30, role: 'user', cartId:'6670669cf941a85735b787b8' }
        const user2 = { email: 'usuario29@example.com', password: '123456', firstName: 'Juan', lastName: 'Pérez', age: 30, role: 'user' }
        const usersRepository = new UsersRepository()
    
        //const result = await usersRepository.createUserWithCart(user1)
        //const result = await usersRepository.createUserWithoutCart(user2)
        //const result = await usersRepository.getAllUsers()
        //const result = await usersRepository.getUserByEmail(user1.email)
        //const result = await usersRepository.getUserByCart('6670669cf941a85735b787b8')
        //const result = await usersRepository.getUserById('66887ca062582de3b31c426f')
        //const result = await usersRepository.setLastConnection(user1.email,'2024-6-2')
        //const result = await usersRepository.setPassword(user1.email,'1234567891011')
        //const result = await usersRepository.setRole(user1.email,'premium')
        //-- REVISAR -- const result = await usersRepository.setCart(user1.email,'6670669cf941a85735b787c2')
        //const result = await usersRepository.userSetEnabled(user1.email,false)
        //const result = await usersRepository.setRecoveryPasswordInfo(user1.email,'242424','2024-7-1')
        // -- REVISAR -- const result = await usersRepository.setUserProfileInfo(user1.email,'Gui','ller',24)
        //const result = await usersRepository.addUserDocument(user1.email,'avatar','refAvat')
        // -- REVISAR -- const result = await usersRepository.deleteUserDocument(user1.email,'avatar')
        // -- REVISAR const result = await usersRepository.updateUserDocument(user1.email,'avatar','refAvat1')
        res.send(result)
    }catch(error){
        res.status(500).json({message: `Error: - ${error.message}`})
    }
   
})
router.post('/mongousersdaocreate',async(req,res)=>{

    const usersMongoDao = new UsersMongoDao()
    const usersArray = [
        { email: 'usuario1@example.com', password: '123456', firstName: 'Juan', lastName: 'Pérez', age: 30, role: 'user' },
        { email: 'usuario2@example.com', password: '123456', firstName: 'María', lastName: 'García', age: 25, role: 'user' },
        { email: 'usuario3@example.com', password: '123456', firstName: 'Pedro', lastName: 'Sánchez', age: 35, role: 'user' },
        { email: 'usuario4@example.com', password: '123456', firstName: 'Ana', lastName: 'Martínez', age: 28, role: 'user' },
        { email: 'usuario5@example.com', password: '123456', firstName: 'Luis', lastName: 'López', age: 32, role: 'user' },
        { email: 'usuario6@example.com', password: '123456', firstName: 'Elena', lastName: 'Rodríguez', age: 27, role: 'user' },
        { email: 'usuario7@example.com', password: '123456', firstName: 'Carlos', lastName: 'Fernández', age: 31, role: 'user' },
        { email: 'usuario8@example.com', password: '123456', firstName: 'Sara', lastName: 'Gómez', age: 29, role: 'user' }
    ]

    const results = []

    for (const item of usersArray) {
        const nuevoUser = await usersMongoDao.create({
            email: item.email,
            password: item.password,
            firstName: item.firstName,
            lastName: item.lastName,
            role: item.role,
            age: item.age,
        });

        console.log('Devuelto:', nuevoUser);

        results.push(nuevoUser);
    }
  

    console.log('Usuarios Creados: ', results)
    res.send(results)
})


router.get('/mongousersdaoget',async(req,res)=>{
    const usersMongoDao = new UsersMongoDao()
    const resultsAll = await usersMongoDao.get()
    const resultsByEmail = await usersMongoDao.get({userEmail:'usuario2@example.com'})
    const resultsByUserId = await usersMongoDao.get({userId:'6686b79ed2eb35c189216515'})
    const resultsByCartId = await usersMongoDao.get({userCartId:'6686b79ed2eb35c189216515'})
    res.json({
        byMail: resultsByEmail,
        byuserId: resultsByUserId,
        resultsByCartId: resultsByCartId,
        all:resultsAll
    })
})

router.post('/mongousersdaodelete',async(req,res)=>{
    const usersMongoDao = new UsersMongoDao()
    const results = await usersMongoDao.delete(['1','2',3,'usuario1@example.com'])

    res.json({results})
})

router.post('/mongousersdaoupdate',async(req,res)=>{
    const usersMongoDao = new UsersMongoDao()
    const results = await usersMongoDao.update(
        {userEmail:'usuario1@example.com',
        updateObject:{

            firstName: 'Guillermoss',
            age: 25,
            documents: [{docName:'dgdgd',docReference:'dgdgdd'}]
            
        }})

    res.json({results})
})



router.post('/repocarts',async(req,res)=>{
    const cartsRepository = new CartRepository()
    //const creado = await cartsRepository.addProductInCart('6682fe0b40c3cfbe98c597f6','664504dc6cccb495261b2fcd',20)
    //const creado = await cartsRepository.updateProductQuantityInCart('6682fe0b40c3cfbe98c597f6','664504dc6cccb495261b2fcd',26)
    //const creado = await cartsRepository.deleteProductFromCart('6682fe0b40c3cfbe98c597f6','664504dc6cccb495261b2fcd')
    //const creado = await cartsRepository.clearCart('6682fe0b40c3cfbe98c597f6')
    //const creado = await cartsRepository.getCartById('6682fe0b40c3cfbe98c597f6')
    //const creado = await cartsRepository.createEmptyCart()
    //const creado = await cartsRepository.createCartWithProductsList([{product:'664504dc6cccb495261b2fcd',quantity:23}])
    const result = await cartsRepository.deleteCart('6670669cf941a85735b787b4')
    res.send(result)
})


router.post('/servicecarts',async(req,res)=>{
    const cartsService = new CartsService()

    const result = await cartsService.createCart()
    //const result = await cartsService.getCartById('6670669cf941a85735b787c0')
    //const result = await cartsService.getProductsInCart('6670669cf941a85735b787c0')
    // --- const result = await cartsService.getProductQuantityInCart('668419db0bbd49392ccb2334','664504dc6cccb495261b2fcd')
    
    res.send(result)
})


router.get('/prueba',async(req,res)=>{

    res.send('pruebas')
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

router.post('/points/crear',async(req,res)=>{
    const point = exchangePointsArray[0]
    

    const exchangePointsService = new ExchangePointsService()
    const newPoint = await exchangePointsService.createExchangePoint(
        point.type,
        point.pointName,
        point.receiver.name,
        point.receiver.last_name,
        point.address.street,
        point.address.streetNumber,
        point.address.floor,
        point.address.apartment,
        point.address.zip_code,
        point.address.city,
        point.address.state,
        point.address.country,
        point.coordinates.latitude,
        point.coordinates.longitude,
        point.phones,
        point.location_type
    )
   res.send(newPoint)
})

router.post('/points/crearpoints', async (req, res) => {
    const exchangePointsService = new ExchangePointsService();
    const createdPoints = [];

    try {
        for (const point of exchangePointsArray) {
            const newPoint = await exchangePointsService.createExchangePoint(
                point.type,
                point.pointName,
                point.receiver.name,
                point.receiver.last_name,
                point.address.street,
                point.address.streetNumber,
                point.address.floor,
                point.address.apartment,
                point.address.zip_code,
                point.address.city,
                point.address.state,
                point.address.country,
                point.coordinates.latitude,
                point.coordinates.longitude,
                point.phones,
                point.location_type
            );
            createdPoints.push(newPoint);
        }

        res.status(200).json(createdPoints);
    } catch (error) {
        console.error('Error al crear puntos de intercambio:', error);
        res.status(500).json({ error: 'Error al crear puntos de intercambio' });
    }
});

router.get('/points/get', async (req, res) => {
    const exchangePointsDao = new ExchangePointsMongoDAO()
    const points = await exchangePointsDao.get({"type": "pickup"})
    res.send(points)

})

router.get('/points/getbyid/:pid', async (req, res) => {
    const {pid:pointId} = req.params
    const exchangePointsService = new ExchangePointsService();
    const point = await exchangePointsService.getExchangePointById(pointId)
    res.send(point)

})

router.put('/points/editbyid/:pid', async (req, res) => {
    const {pid:pointId} = req.params
    const exchangePointsService = new ExchangePointsService();
    const point = await exchangePointsService.updateExchangePoint(pointId)
    res.send(point)

})

router.get('/points/pick', async (req, res) => {
    
    const exchangePointsService = new ExchangePointsService();
    const points = await exchangePointsService.getPickupPoints()
    res.send(points)

})

router.get('/points/delivery', async (req, res) => {
    
    const exchangePointsService = new ExchangePointsService();
    const points = await exchangePointsService.getDeliveryPoints()
    res.send(points)

})


router.get('/productsnew/:pid', async (req, res) => {
    const {pid:productId} = req.params
    const productsRepository = new ProductsRepository()
    const product = await productsRepository.getProductById(productId)
    res.send(product)

})

router.get('/productscode/:code', async (req, res) => {
    const {code} = req.params
    const productsRepository = new ProductsRepository()
    const product = await productsRepository.getProductByCode(code)
    const exist = await productsRepository.existProductByCode(code)
    console.log('Existe: ',exist)
    res.send(product)

})

router.post('/productstock/:pid', async (req, res) => {
    const {pid:productId} = req.params
    const productsRepository = new ProductsRepository()
    const product = await productsRepository.updateStock(productId,241)
    res.send(product)

})

router.post('/productstatus/:pid', async (req, res) => {
    const {pid:productId} = req.params
    const productsRepository = new ProductsRepository()
    const product = await productsRepository.changeProductStatus(productId)
    res.send(product)

})

router.delete('/productdelete/:pid', async (req, res) => {
    const {pid:productId} = req.params
    const productsRepository = new ProductsRepository()
    const product = await productsRepository.deleteProduct(productId)
    res.send(product)

})


router.post('/productsadd', async (req, res) => {
    const productsService = new ProductsService()
    const product =  {
        "title": "AGV Pista GP RR Iridium Helmet",
        "description": "Descripcion de AGV Pista GP RR Iridium Helmet",
        "price": 1899,
        "img": "https://www.thehelmetwarehouse.com.au/image/cache/catalog/AGV/PISTA%20GP%20RR/pist%20iridium-200x200.jpg",
        "code": "3333344aaaaasassasa",
        "category": "cascos",
        "owner": null,
        "stock": 1295,
        "status": true,
        "thumbnails": [
         "https://www.thehelmetwarehouse.com.au/image/cache/catalog/AGV/PISTA%20GP%20RR/pist%20iridium-200x200.jpg",
         "https://www.thehelmetwarehouse.com.au/image/cache/catalog/AGV/PISTA%20GP%20RR/pist%20iridium-200x200.jpg",
         "https://www.thehelmetwarehouse.com.au/image/cache/catalog/AGV/PISTA%20GP%20RR/pist%20iridium-200x200.jpg",
         "https://www.thehelmetwarehouse.com.au/image/cache/catalog/AGV/PISTA%20GP%20RR/pist%20iridium-200x200.jpg"
        ]
       }

    const newProduct = await productsService.addProduct(product)
    res.send(newProduct)

})

router.get('/productcategories',async(req,res)=>{
    const productsService = new ProductsService()
    const categories = await productsService.getProductsCategoriesList()
    res.send(categories)
})

router.put('/productstatus/:pid',async(req,res)=>{
    const {pid:productId} = req.params
    const productsService = new ProductsService()
    const pdc = await productsService.changeProductStatusById(productId)
    res.send(pdc)
})

router.put('/productstock/:pid',async(req,res)=>{
    const {pid:productId} = req.params
    const productsService = new ProductsService()
    const pdc = await productsService.updateProductStockById(productId,0)
    res.send(pdc)
})

router.delete('/productdeletes/:pid',async(req,res)=>{
    const {pid:productId} = req.params
    const productsService = new ProductsService()
    const pdc = await productsService.deleteProductById(productId)
    res.send(pdc)
})

router.get('/productsget',async(req,res)=>{
    const productsService = new ProductsService()
    const pds = await productsService.getProducts()
    res.send(pds)
})




