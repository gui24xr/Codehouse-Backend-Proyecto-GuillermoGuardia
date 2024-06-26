import { ProductRepository } from "../repositories/products.repositories.js";
//import { CartRepository } from "../repositories/cart.repositories.js";
import { CartsService } from "../services/carts.service.js";

import { TicketsRepositories } from "../repositories/ticket.repositories.js";
import { CheckoutService } from "../services/checkout/checkout-service.js";
import { getMissingFields } from "../utils/helpers.js";
import { IncompleteFieldsError, UsersServiceError, CartsServiceError, InternalServerError, CheckoutServiceError, ProductsServiceError, TicketsServiceError } from "../services/errors/custom-errors.js";

import { transformDate } from "../utils/hour.js";
const productsRepository = new ProductRepository();

//const cartsRepository = new CartRepository();
const cartsService = new CartsService()
const checkoutService = new CheckoutService();
const ticketRepositories = new TicketsRepositories();

export class ViewsController {
  
  
  /*async viewHome(req, res) {
    //Teniendo en cuenta que en res.locals.sessionData tenemos datos de si hay token activo
    //SI al entrar a home encontramos que hay user logueado lo redirijo a la vista viewproductspaginate
    //Si no hay user con token.
    //console.log('ssfs: ',res.locals.sessionData)

    if (res.locals.sessionData.login) {
      res.redirect("/views/mainproductslist");
    } else {
      try {
        const productsList = await productsRepository.getProducts();
        const mappedProducts = productsList.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          img: item.img,
          code: item.code,
          category: item.category,
          stock: item.stock,
          status: item.status,
          thumbnails: item.thumbnails,
        }));
        res.render("home", { productsList: mappedProducts });
      } catch (error) {
        throw new Error("Error al intentar mostrar la vista productos...");
      }
    }
  }
  */

  async viewProductsList(req, res,next) {
    console.log(res);
    try {
      const productsList = await productsRepository.getProducts();
      const mappedProducts = productsList.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        img: item.img,
        code: item.code,
        category: item.category,
        stock: item.stock,
        status: item.status,
        thumbnails: item.thumbnails,
      }));

      //Ademas de enviar los productos mapeados para handlebar envio la informacion de sesion para utilizar en el script
      res.render("products", { productsList: mappedProducts });
    } catch (error) {
      throw new Error("Error al intentar mostrar la vista productos...");
    }
  }

  async viewMainProductsList(req, res,next) {
    const {selectedCategory,selectedQuantityPerPage,selectedPage} = req.query
    const defaultQuantityPerPage = 15
    const defaultPage = 1
    console.log('query: ', req.query)

      try {
        const filter = !selectedCategory ? {status:true} : {category:selectedCategory.toLowerCase(),status:true}
        const quantityPerPage = !selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage
        const page = !selectedPage ? defaultPage : selectedPage    
        console.log('page: ', page )

        const categoriesList = await productsRepository.getProductsCategoriesList() 
        const filteredData = await productsRepository.getProductsByFilter(filter,quantityPerPage,page)
       // console.log('Filtrados: ',filteredData)
      //Hago un mapeo de docs para mandar a rendrizar en handlebars.
      const mappedProducts = filteredData.matches.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        img: item.img,
        code: item.code,
        category: item.category,
        stock: item.stock,
        status: item.status,
        thumbnails: item.thumbnails,
      }));

      //Valores que necesito para renderizar con handlebars.
      const valuesToRender = {
        //AH categories list le agrego productsPerPage para el renderizado de hbs que no permite inresar directo.
        categoriesList:categoriesList.map(item => ({...item,productsPerPage:!selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage,})),
        selectedCategory: !selectedCategory ? 'Todas las categorias': selectedCategory.toUpperCase(),
        selectedPage: !selectedPage ? defaultPage : selectedPage,
        productsQuantity: filteredData.totalMatches,
        productsPerPage: !selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage,
        productsList: mappedProducts,
        pagesQuantity: filteredData.pagesQuantity,
        pagesNumberArray: Array.from({ length: filteredData.pagesQuantity }, (_, indice) => indice + 1),
        //En esta propiedad viaja la ifnromacion del user logueado.
        loggedUserInfo: JSON.stringify(res.locals.sessionData),
        selectedValueFilters : JSON.stringify({
          actualSelectedCategory: !selectedCategory ? undefined : selectedCategory,
          actualSelectedPage: !selectedPage ? defaultPage : selectedPage,
          actualProductsPerPage: !selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage,
          actualPagesQuantity: filteredData.pagesQuantity,
        })
      };

      
      res.render("mainproducts", valuesToRender);
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
      throw new Error("Error al intentar obtener productos con paginacion...");
    }
  }



  //Aca buscamos el
  async viewSearchPage(req, res,next) {
    const {requiredFilter} = req.params
    const { reqQuantity, page, sort, selectedCategory } = req.query;
    console.log('Parametros que llegaron', req.query)
    //console.log('Variables de sesion: ',res.locals.sessionData)
  
    try {

      const categoriesList = await productsRepository.getProductsCategoriesList() 

      if ((Object.keys(req.query).length < 1) && Object.keys(req.params).length < 1)  {
        //uso la filter
      }
      //Sort el formulario solo permitira que solo llegue -1,1 o 0
      //Por ahora dejo query para que entre por params
      //La idea es cuanto este implementado en el form armar la query para enviar al manager
      const sortValue = sort == "1" ? 1 : sort == "-1" ? -1 : 0; //console.log('SortValue', sortValue)
      
      //Filtro es siempre todoas {} //Recordar que productPagiante lo configure para devolver solo productos status:true
      //A ese status true se le agregara nada si mando {} o sea quiero ver solo lo activo
      //Pero si me pasaron uan categoria que existe entonces mando el filtro
      let filter = {}

      

      const paginate = await productsRepository.getProductsPaginate(2,1,1,{status:true})

     //console.log('ppp: ', paginate)

//      //Hago un mapeo de docs para mandar a rendrizar en handlebars.
      const mappedProducts = paginate.docs.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        img: item.img,
        code: item.code,
        category: item.category,
        stock: item.stock,
        status: item.status,
        thumbnails: item.thumbnails,
      }));

      //Valores que necesito para renderizar con handlebars.
      const valuesToRender = {
        categoriesList:categoriesList,
        selectedCategory: selectedCategory,
        productsList: mappedProducts,
        totalDocs: paginate.totalDocs,
        hasPrevPage: paginate.hasPrevPage ? "SI" : "No",
        hasNextage: paginate.hasNextPage ? "SI" : "No",
        prevPage: paginate.prevPage ? paginate.prevPage : "-",
        nextPage: paginate.nextPage ? paginate.nextPage : "-",
        actualPage: paginate.page,
        totalPages: paginate.totalPages,
        limit: paginate.limit,
        order: sortValue == '-1' ? 'Mayor a menor precio' : 'Menor a mayor precio',
        paginateValuesToScript: JSON.stringify(paginate),
        //En esta propiedad viaja la ifnromacion del user logueado.
        loggedUserInfo: JSON.stringify(res.locals.sessionData),
      };

      res.render("productspaginate", valuesToRender);
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
      throw new Error("Error al intentar obtener productos con paginacion...");
    }
  }






  async viewProduct(req, res,next) {
    const { pid: productId } = req.params;
    try {
      const product = await productsRepository.getProductById(productId);
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
        thumbnails: product.thumbnails,
      };

      const valuesToRender = {
        productDetail: productDetail,
        loggedUserInfo: JSON.stringify(res.locals.sessionData),
      };
      res.render("productdetail", valuesToRender);
    } catch (error) {
      throw new Error("Error al intentar mostrar vista producto...");
    }
  }

  viewRealTimeProducts(req, res) {
    res.render("realTimeProducts");
  }

  /*
  viewLogout(req, res,next) {
    //Diferente a logout de api
    //Este logou es para vistas, hace lo mismo pero ademas redirigje y acomdoda variables
    //Limpia de las cookies el token existente
    //Busca el token que tiene el nombre de los token de nuestra app.
    res.clearCookie(process.env.COOKIE_AUTH_TOKEN);
    //Limpio mis variables de sesion
    res.locals.sessionData.login = false;
    res.redirect("/");
  }
    */

  /*
  async viewLoginPost(req, res,next) {
    //Hace lo mismo que api/login pero si esta todo Ok redirecciona a home
    //Si home detecta que hay un jwt valido entonces reenvia a products
    //No es necesario setear las variablesd e sesion xq de eso se encarga el middleware que fabrique y extrae los datos del JWT y los pone en req.sessions.global
    const { email, password } = req.body; // console.log(req.body)
    const requiredFields = ['email', 'password']
    const missingFields = getMissingFields(req.body,requiredFields)
    try {
      if (missingFields.length > 0)  throw new IncompleteFieldsError(`Faltan ingresar los siguientes campos: ${missingFields}`)
      const authenticateUser = await usersRepository.authenticateUser(email,password)
      //Salio Ok entonces envio token con la informacion del usuario
      res.cookie(process.env.COOKIE_AUTH_TOKEN, generateJWT(authenticateUser), {maxAge: 3600000,  httpOnly: true  })
      //Redirijo a la raiz y va a aparecer logueado y la barra de sesion con su info gracias a la lectura del token y el middleware
      res.redirect("/")
      
    } catch (error) {
      if (error instanceof IncompleteFieldsError) res.status(400).render("messagepage", { message: error.message });
      else 
      if (error instanceof  UsersServiceError) res.status(409).render("messagepage", { message: error.message });
      else
      next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||viewsController.viewLoginPost||...'))

    }
  }
  */
/*
  async viewRegisterPost(req, res) {
    //Por ahora vamos a bloquear que desde el fron se puedan crear admin
    const {first_name, last_name, email, password,age, role} = req.body;
    const requiredFields = ['first_name', 'last_name', 'email', 'password','age']
    const missingFields = getMissingFields(req.body,requiredFields)

    try {
      //Controlamos que no falten datos necesarios para crear un user....
      if (missingFields.length > 0)  throw new IncompleteFieldsError(`Faltan ingresar los siguientes campos: ${missingFields}`)
      //SI Estan todos los campos necesarios entonces se procede...
      const createdUser = await usersRepository.createUser({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: createHash(password),
        age: age,
        role: role,
      });
     //Salio todo Ok entonces procedo a renderizar....
        res.status(200).render("messagepage", { message: `Se ha creado correctamente el usuario ${createdUser.email} !!` });
     } catch (error) {
      if (error instanceof IncompleteFieldsError) res.status(400).render("messagepage", { message: error.message });
      else 
      if (error instanceof  UsersServiceError) res.status(409).render("messagepage", { message: error.message });
      else
      next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||usersController.createUser||...'))
    }
  }
  */

  viewLoginGet(req, res,next) {
    console.log('Entro a viewloginget')
    res.render("login");
  }

  viewRegisterGet(req, res,next) {
    res.render("register");
  }

  viewChat(req, res,next) {
    //SI estamos sin token pedira el email para corroborar que no sea admin ya que los mismos no puden ingresar al chat
    const { email } = req.query;
    //Le mandamos el mail/nombre de usuario
    res.render("chat/chat", { activeUser: email });
  }

  async viewProfile(req, res,next) {
    /*Esta vista envia a los datos de perfil del usuario renderizando la plantilla profile.
    en este caso dado que tengo el middleware que agrega los datos del token al objeto res 
    uso el objeto res en la plantilla, asique simplemente la mando a renderizar */
    res.render("profile");
  }


  async viewCart(req, res,next) {
    const { cid: cartId } = req.params; 
    try {
      const searchedCart = await cartsService.getCartById(cartId) 


      /* GRACIAS AL USO DE CARTDTO YA NO ES NECESARIO ESTO PORQUE ESTANDARICE EL OBJETO CART
        y ahora es un DTO y sus productos estan formato ProducDTO
     // Mapeo con lo que necesito para renderizar y para entregar a hbds
      const productsInCart = searchedCart.products.map((item) => ({
        id: item.product.indice,
        img: item.product.img,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        totalAmount: (Number(item.quantity) * Number(item.product.price)).toFixed(2),
      }
    ))
    */
      
      res.render("cart", {
        cartId:cartId,
        productsList: searchedCart.products,//productsInCart,
        cartAmount: searchedCart.cartAmount,
      })

    } catch (error) {
      if (error instanceof  CartsServiceError) res.status(409).render("messagepage", { message: error.message });
      else
      next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||viewsController.ViewCart||...'))
    }
  }


  /*
  async viewPurchase(req, res,next) {
    const { cid: cartId } = req.params;
    try {
      const checkoutResult = await checkoutService.checkOutCart(cartId);
      //Tomo todo de checkout result para renderizar.
      const moment = transformDate(checkoutResult.ticket.purchase_datetime);
      
      const valuesToRender = {
        detailsList: checkoutResult.ticket.details,
        price: checkoutResult.ticket.price.toFixed(1),
        transactionDate: moment.date,
        transactionHour: moment.hour,
        ticketCode: checkoutResult.ticket.code,
      }
      
      res.status(200).render("checkoutresult",valuesToRender );  
      
    } catch (error) {
     if (
        error instanceof CartsServiceError ||
        error instanceof CheckoutServiceError ||
        error instanceof ProductsServiceError ||
        error instanceof TicketsServiceError
    ) {
        res.status(400).render("messagepage", { message: error.message });
    } else {
        next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||viewsController.viewPurchase||...'));
    }
    
    }  
    }
  */
 
    
  async viewPurchase(req, res,next) {
    const { tcode: ticketCode } = req.params;
    try {
      const searchedTicket = await checkoutService.getTicketInfoByCode(ticketCode)
      //Tomo todo de checkout result para renderizar.
      const moment = transformDate(searchedTicket.purchase_datetime);
      
      const valuesToRender = {
        detailsList: searchedTicket.details,
        price: searchedTicket.price.toFixed(1),
        transactionDate: moment.date,
        transactionHour: moment.hour,
        ticketCode: searchedTicket.code,
      }
      
      res.status(200).render("checkoutresult",valuesToRender );  
      
    } catch (error) {
     if (
       
        error instanceof CheckoutServiceError ||
        error instanceof ProductsServiceError ||
        error instanceof TicketsServiceError
    ) {
        res.status(400).render("messagepage", { message: error.message });
    } else {
        next(new InternalServerError(InternalServerError.GENERIC_ERROR, 'Error in ||viewsController.viewPurchase||...'));
    }
    
    }  
    }

    
  




/*
  async viewSinglePurchase(req, res,next) {
    const { pid: productId, qid: quantity, uid: userId } = req.params; //console.log(req.params)
    try {
      const purchaseTicket = await checkoutService.checkoutProductBuy(productId,quantity,userId)
    
        //console.log('Detalle ticket: ', checkoutResult.ticket.details)
        const moment = transformDate(purchaseTicket.purchase_datetime);
        const valuesToRender =  {
          detailsList: purchaseTicket.details,
          price:purchaseTicket.price.toFixed(1),
          transactionDate: moment.date,
          transactionHour: moment.hour,
          ticketCode: purchaseTicket.code,
        }
        res.status(200).render("checkoutresult",valuesToRender);
     
    } catch (error) {
      if (error instanceof (CartsServiceError || CheckoutServiceError ||ProductsServiceError ||TicketsServiceError ))  res.status(400).render("messagepage", { message: error.message })
        else {
            next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||viewsController.viewSinglePurchase||...'))
        }
    }
  }
*/


  async viewTickets(req, res,next) {
    const { uid: userId } = req.params;
    try {
      //const searchResult = await ticketRepositories.getTickets({purchaser:'663120ceda09d7ad646a4000'})
      const ticketsList = await ticketRepositories.getTicketsByPurchaser(userId);
      //Obtengo un array tengo que procesarlo para mostrar en hdbs.
      const ticketsFromPurchaser = [];
      //console.log('Detalle ticket: ', checkoutResult.ticket.details)
      ticketsList.forEach((item) => {
          const moment = transformDate(item.purchase_datetime);
          ticketsFromPurchaser.push({
            detailsList: item.details,
            price: item.price.toFixed(1),
            transactionDate: moment.date,
            transactionHour: moment.hour,
            ticketCode: item.code,
          });
        });
        ticketsFromPurchaser.reverse();
        res.status(200).render("tickets", { ticketsList: ticketsFromPurchaser });
    
      
    } catch (error) {
      if (error instanceof TicketsServiceError )  res.status(400).render("messagepage", { message: error.message })
        else {
            next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||viewsController.viewTickets||...'))
        }
  }
}

}
