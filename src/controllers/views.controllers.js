import { UsersService } from "../services/users.service.js";
import { ProductsService } from "../services/products.service.js";
import { ProductsRepository } from "../repositories/products-repositories.js";
import { CartsService } from "../services/carts.service.js";
import { TicketsRepositories } from "../repositories/ticket.repositories.js";
import { CheckoutService } from "../services/checkout/checkout-service.js";



//-----------------------------------
import { 
  IncompleteFieldsError,
  UsersServiceError,
  CartsServiceError,
  ProductsServiceError,
  TicketsServiceError,
  CheckoutServiceError,
  InternalServerError,
  UserDTOERROR

} from "../services/errors.service.js";

import { transformDate } from "../utils/hour.js";
const productsRepository = new ProductsRepository();

//const cartsRepository = new CartRepository();
const cartsService = new CartsService()
const checkoutService = new CheckoutService();
const ticketRepositories = new TicketsRepositories();




//-------------------------------------------
const usersService = new UsersService()
const productsService = new ProductsService()
//-------------------------------------------

export class ViewsController {
  
  

  //FUNCIONA Y FALTA DEREIVAR A ERRORES
  async viewMainProductsList(req, res,next) {
    const {selectedCategory,selectedQuantityPerPage,selectedPage} = req.query
    const defaultQuantityPerPage = 15
    const defaultPage = 1
    try {
      const filter = !selectedCategory ? {status:true} : {category:selectedCategory.toLowerCase(),status:true}
      const quantityPerPage = !selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage
      const page = !selectedPage ? defaultPage : selectedPage 
       
       // Pido los productos al servicioy me da los productDTO mas el paginado.
       const filteredDataObject = await productsService.findProducts({
          limit: quantityPerPage,
          page: page,
          category: filter.category,
          status: filter.status
       })

       //Lista de categorias.
       const categoriesList = await productsService.getProductsCategories()

      //Valores que necesito para renderizar con handlebars.
      const valuesToRender = {
        //AH categories list le agrego productsPerPage para el renderizado de hbs que no permite inresar directo.
        categoriesList:categoriesList.map(item => ({categoryName:item,productsPerPage:!selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage,})),
        selectedCategory: !selectedCategory ? 'Todas las categorias': selectedCategory.toUpperCase(),
        selectedPage: !selectedPage ? defaultPage : selectedPage,
        productsQuantity: filteredDataObject.totalProducts,
        productsPerPage: !selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage,
        productsList: filteredDataObject.productsQueryList,
        pagesQuantity: filteredDataObject.totalPages,
        pagesNumberArray: Array.from({ length: filteredDataObject.totalPages }, (_, indice) => indice + 1),   
        currentUser: req.currentUser,

        selectedValueFilters : JSON.stringify({
          actualSelectedCategory: !selectedCategory ? undefined : selectedCategory,
          actualSelectedPage: !selectedPage ? defaultPage : selectedPage,
          actualProductsPerPage: !selectedQuantityPerPage ? defaultQuantityPerPage : selectedQuantityPerPage,
          actualPagesQuantity: filteredDataObject.page,
        })
      }
      res.render("mainproducts", valuesToRender);
    } catch (error) {
    
      res.status(500).json({ error: "Error del servidor" });
      throw new Error("Error al intentar obtener productos con paginacion...");
    }
  }





  async viewProductDetail(req, res,next) {
    const { pid: productId } = req.params;

    try {
        // Pido al servicio de productos el producto por su id y me devuelve el objeto paginacion.
        const filteredDataObject = await productsService.findProducts({productId:productId})

       //Lista de categorias para seguirlas teniendo en el menu.
       const categoriesList = await productsService.getProductsCategories()
       //Como sabemos que viene dentro del objeto de busqueda.
       if (!(filteredDataObject.productsQueryList.totalProducts > 0)) console.log('LANZAR ERROR DE VISTAS')
       //Como sabemos que es solo uno, viene en la posicion cero
       const product = filteredDataObject.productsQueryList[0]
      //ya tengo el producto, ahora lo proceso para poder usarlo en handlebars
      
     
      res.render("productdetail", {
        product: product,
        currentUser: req.currentUser,
      })
    } catch (error) {
      throw new Error("Error al intentar mostrar vista producto...");
    }
  }


  viewRealTimeProducts(req, res) {
    res.render("realTimeProducts");
  }

 
  viewLoginGet(req, res,next) {
    console.log('Entro a viewloginget')
    res.render("login",{currentUser: req.currentUser});
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
    res.render("profile",{currentUser: req.currentUser});
  }


  async viewCart(req, res,next) {
    const { cid: cartId } = req.params; 
    try {
      const searchedCart = await cartsService.getCartById(cartId) 

      res.render("cart", {
        cartId:cartId,
        productsList: searchedCart.products,//productsInCart,
        cartAmount: searchedCart.cartAmount,
        currentUser: req.currentUser,


      })

    } catch (error) {
      if (error instanceof  CartsServiceError) res.status(409).render("messagepage", { message: error.message });
      else
      next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||viewsController.ViewCart||...'))
    }
  }


  
    
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



//--------- VISTAS CON CAPAS Y USANDO SERVICIOS...

async viewUsersList(req,res,next){

  function formatearFecha(dateString){
    //Formatea una fecha que viene en formato horrible y retorna el string.
    const dateObj = new Date(dateString)
    // Obtener componentes de la fecha
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Sumar 1 al mes porque en JavaScript los meses van de 0 a 11
  const day = ('0' + dateObj.getDate()).slice(-2);
  const hours = ('0' + dateObj.getHours()).slice(-2);
  const minutes = ('0' + dateObj.getMinutes()).slice(-2);

  // Construir la cadena en el formato deseado
    return `${year}-${month}-${day}  ${hours}:${minutes}`;
  }

  try{
    //Me traigo todos los usuarios. Obtengo una lista de usersDTO
    const usersList = await usersService.getAllUsers()
    //Mapeo para que la hora se vea linda y el enabled se vea como activo o inactivo.
    
    const mappedUsersList = usersList.map(item => ({
      email : item.email,
      enabled:  item.enabled ? 'Activo' : 'Inactivo',
      role: item.role,
      firstName: item.firstName,
      lastName: item.lastName,
      avatar: item.avatar,
      createdAt: formatearFecha(item.createdAt)
    }))
    res.status(200).render("userslist",{usersList:mappedUsersList})
    
  }catch(error){
   
    if (error instanceof UsersServiceError || error instanceof UserDTOERROR ){
      res.status(400).render("messagepage", { message: error.message })
    }  
      else {
          next(new InternalServerError(InternalServerError.GENERIC_ERROR,'Error in ||viewsController.viewTickets||...'))
      }
  }

  }


}




