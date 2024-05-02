import { ProductRepository } from "../repositories/products.repositories.js"
import { CartRepository } from "../repositories/cart.repositories.js"
import { UsersRepository } from "../repositories/users.repositories.js"
import { TicketsRepositories } from "../repositories/ticket.repositories.js"
import { generateJWT } from "../utils/jwt.js"
import { createHash } from "../utils/hashbcryp.js"
import { CheckoutService } from "../services/checkout-service.js"

import { transformDate } from "../utils/hour.js"
const productsRepository = new ProductRepository()
const usersRepository = new UsersRepository()
const cartsRepository = new CartRepository()
const checkoutService = new CheckoutService()
const ticketRepositories = new TicketsRepositories()

export class ViewsController{

    async viewHome(req,res){
        //Teniendo en cuenta que en res.locals.sessionData tenemos datos de si hay token activo 
        //SI al entrar a home encontramos que hay user logueado lo redirijo a la vista viewproductspaginate
        //Si no hay user con token.
        //console.log('ssfs: ',res.locals.sessionData)

        if (res.locals.sessionData.login){
            res.redirect('/views/productslistpaginate')
        }
        else {
            try{
                const productsList = await productsRepository.getProducts()
                const mappedProducts = productsList.map(item => ({
                    id: item.id, 
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    img: item.img,
                    code: item.code,
                    category: item.category,
                    stock: item.stock,
                    status: item.status,
                    thumbnails: item.thumbnails
                }))
                res.render('home',{productsList:mappedProducts})
    
            }catch(error){
                throw new Error('Error al intentar mostrar la vista productos...')
            }


            
        
        }
    }

    async viewProductsList(req,res){
        console.log(res)
        try{
            const productsList = await productsRepository.getProducts()
            const mappedProducts = productsList.map(item => ({
                id: item.id, 
                title: item.title,
                description: item.description,
                price: item.price,
                img: item.img,
                code: item.code,
                category: item.category,
                stock: item.stock,
                status: item.status,
                thumbnails: item.thumbnails
            }))

            //Ademas de enviar los productos mapeados para handlebar envio la informacion de sesion para utilizar en el script
            res.render('products',{productsList:mappedProducts})

        }catch(error){
            throw new Error('Error al intentar mostrar la vista productos...')
        }
    }

    
async viewProductsListPaginate(req,res){
    const {limit,page,sort,query} = req.query     
    //console.log('Parametros que llegaron', limit,page,sort,query)
    //console.log('Variables de sesion: ',res.locals.sessionData)
    try{
        //Sort el formulario solo permitira que solo llegue -1,1 o 0
        //Por ahora dejo query para que entre por params
        //La idea es cuanto este implementado en el form armar la query para enviar al manager
        const sortValue = sort == '1' ? 1 : sort == '-1' ? -1 : 0   //console.log('SortValue', sortValue)
        const paginate = await productsRepository.getProductsPaginate(limit ? limit : 100,page ? page : page,sortValue,query)
        //Hago un mapeo de docs para mandar a rendrizar en handlebars. 
        const mappedProducts = paginate.docs.map(item => ({
            id: item.id, 
            title: item.title,
            description: item.description,
            price: item.price,
            img: item.img,
            code: item.code,
            category: item.category,
            stock: item.stock,
            status: item.status,
            thumbnails: item.thumbnails
        }))

        //Valores que necesito para renderizar con handlebars.
       const valuesToRender = {
        productsList:mappedProducts,
        totalDocs : paginate.totalDocs,
        hasPrevPage : paginate.hasPrevPage ? 'SI' : 'No',
        hasNextage : paginate.hasNextPage ? 'SI' : 'No',
        prevPage: paginate.prevPage ? paginate.prevPage : '-',
        nextPage: paginate.nextPage ? paginate.nextPage : '-',
        actualPage: paginate.page,
        totalPages: paginate.totalPages,
        limit: paginate.limit,
        paginateValuesToScript: JSON.stringify(paginate),
        //En esta propiedad viaja la ifnromacion del user logueado.
        loggedUserInfo:JSON.stringify(res.locals.sessionData)
       }

       res.render('productspaginate',valuesToRender)

    }catch(error){
         res.status(500).json({error: 'Error del servidor'})
        throw new Error('Error al intentar obtener productos con paginacion...')
    }
}






    async viewProduct(req,res){
        const {pid:productId} = req.params
        try{
            const product = await productsRepository.getProductById(productId)
              //ya tengo el producto, ahora lo proceso para poder usarlo en handlebars
        const productDetail = {
            id: product._id, 
            title: product.title,
            description: product.description,
            price: product.price,
            img: product.img,
            code: product.code,
            category: product.category,
            stock: product.stock,
            status: product.status,
            thumbnails: product.thumbnails
        }

       res.render('productdetail', {productDetail: productDetail})
        }catch(error){
            throw new Error('Error al intentar mostrar vista producto...')
        }
    }


    viewRealTimeProducts(req,res){
        res.render("realTimeProducts")
    }

    viewLogout(req,res){
        //Diferente a logout de api
        //Este logou es para vistas, hace lo mismo pero ademas redirigje y acomdoda variables
          //Limpia de las cookies el token existente
          console.log('Entre por aca')
          //Busca el token que tiene el nombre de los token de nuestra app.
          res.clearCookie("sessiontoken");
          //Limpio mis variables de sesion 
          res.locals.sessionData.login = false
        res.redirect('/')
    }

    async viewLoginPost(req,res){
        //Hace lo mismo que api/login pero si esta todo Ok redirecciona a home
        //Si home detecta que hay un jwt valido entonces reenvia a products
        //No es necesario setear las variablesd e sesion xq de eso se encarga el middleware que fabriqu y leee JWT
        const {email,password} = req.body 
        console.log(req.body) 
        try {
            const authenticateResult = await usersRepository.authenticateUser(email,password)
            if (authenticateResult.isSuccess){
                //Salio Ok entonces envio token con la informacion del usuario
                //const token = jwt.sign({user: {...authenticateResult.user}},'coderhouse',{expiresIn:"1h"})
                res.cookie("sessiontoken", generateJWT(authenticateResult.user), {maxAge: 3600000,  httpOnly: true  })
               //res.redirect('/products') //Envio a la raiz y va a aparecer logueado y la barra de sesion con su info gracias a la lectura del token y el middleware
                res.redirect('/')
              
             }
            else{
                res.render('messagepage',{message:`El usuario ${email} no se encuentra registrado en nuestra tienda....`})
            }
        } catch (error) {
            throw new Error('Error al intentar logear usuario...')
        }

    }

    
    async viewRegisterPost(req,res){
        const {first_name, last_name, email, password,age, role} = req.body;
       // console.log(req.body,'4545445454')
        try {
             const createdUser = await usersRepository.createUser({
                first_name : first_name,
                last_name : last_name,
                email: email,
                password: createHash(password),
                age: age,
                role: role
            })
        
            if (createdUser.isSuccess) res.render('messagepage',{message: createdUser.message})
            else res.status(500).render('messagepage',{message: createdUser.message})
            
        }
        catch(error){
            throw new Error('Error al intentar crear usuario...')
        }
    }



    viewLoginGet(req,res){
        res.render('login')
    }

    viewRegisterGet(req,res){
        res.render('register')
    }


    viewChat(req,res){
        //SI estamos sin token pedira el email para corroborar que no sea admin ya que los mismos no puden ingresar al chat
        const {email} = req.query
        //Le mandamos el mail/nombre de usuario
        res.render('chat/chat',{activeUser:email})
   }

   async viewProfile(req,res){
    /*Esta vista envia a los datos de perfil del usuario renderizando la plantilla profile.
    en este caso dado que tengo el middleware que agrega los datos del token al objeto res 
    uso el objeto res en la plantilla, asique simplemente la mando a renderizar */
    res.render('profile')
   }



   
async viewCart(req,res){
        const {cid:cartId} = req.params //console.log(req.params)
        try{
           const searchedCart = await cartsRepository.getCartById(cartId) //console.log('Cart:', searchedCart )
          
          // Mapeo para entregar a hbds
            const productsInCart = searchedCart.products.map(item => ({
                id:item.product._id,
                img:item.product.img,
                title:item.product.title,
                price:item.product.price,
                quantity:item.quantity,
                totalAmount: (Number(item.quantity) * Number(item.product.price)).toFixed(2)
            }))//console.log('Produclist: ',productsList)
            res.render('cart',{cartId:cartId,productsList:productsInCart,cartAmount: searchedCart.cartAmount})
        }
         catch(error){
            throw new Error('Error al intentar renderizar vista cart desde funcion viewcart...')   
        }
}
 

async viewPurchase(req,res){
    const {cid:cartId} = req.params
    try{
        const checkoutResult = await checkoutService.checkOutCart(cartId)
        //Tomo todo de checkout result para renderizar.
        if (checkoutResult.success){//console.log('Detalle ticket: ', checkoutResult.ticket.details)
            const moment = transformDate(checkoutResult.ticket.purchase_datetime)
            res.status(200).render('checkoutresult',{
                detailsList: checkoutResult.ticket.details,
                price: (checkoutResult.ticket.price).toFixed(1),
                transactionDate: moment.date,
                transactionHour: moment.hour,
                ticketCode: checkoutResult.ticket.code,
            })
        }
        else{
            res.status(500).render('messagepage',{message: checkoutResult.message})
        }
    
    }catch(error){
        throw new Error('Error al intentar renderizar purchaseview...')
    }
    
}



 async viewTickets(req,res){
    const {uid:userId} = req.params
    try{
        //const searchResult = await ticketRepositories.getTickets({purchaser:'663120ceda09d7ad646a4000'})
        const result = await ticketRepositories.getTicketsByPurchaser(userId)
         //Obtengo un array tengo que procesarlo.
        const ticketsFromPurchaser = []
        if (result.success){//console.log('Detalle ticket: ', checkoutResult.ticket.details)
            
            result.tickets.forEach (item =>{
                const moment = transformDate(item.purchase_datetime)
                ticketsFromPurchaser.push({
                    detailsList: item.details,
                    price: (item.price).toFixed(1),
                    transactionDate: moment.date,
                    transactionHour: moment.hour,
                    ticketCode: item.code,
                })
           })
           ticketsFromPurchaser.reverse()
        res.status(200).render('tickets',{ticketsList:ticketsFromPurchaser})
           
        }
        else{
            res.status(500).render('messagepage',{message: result.message})
        }
    
    }catch(error){
        throw new Error('Error en prueba gettickets...')
    }
}


}