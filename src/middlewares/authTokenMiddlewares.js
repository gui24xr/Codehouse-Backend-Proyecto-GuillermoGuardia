
import { CartsService } from "../services/carts.service.js";


const cartsService = new CartsService()

import passport from "passport";
import { UnauthorizedError, TokenVerificationError } from "../services/errors/custom-errors.js";


//Este middleware lo utilizare para enviar a handlebars siempre los datos de sesion
//Y no tener que enviarlos plantilla por plantilla

/*Este middleware se encargara de:

  Ya que trabajo con JWT tener en variables globales datos de usuario para alimentar plantillas
  Dado que mi app esta configurada para que los json web token tenga la siguiente info
  user, role

*/

async function infoUserFromToken(req, res, next) {
  // Llamada a Passport para autenticar con la estrategia 'jwt'
  // Este middleware solo lo uso para a travez de objeto res hacer viajar los dtos de user logueado  
  //De esa manera no mandar a cada plantilla lo datos del token en cada res.render
  //Por lo tanto solo lo usaran las views y el routes de views
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      if (err) { return next(new TokenVerificationError.GENERIC_ERROR, err.message) }
      if (!user) { 
        res.locals.sessionData  = {
          login: false
        }
        return next(); 
      }

      res.locals.sessionData  = {
        login: true,
        user: user.user, 
        admin: user.user.role == 'admin' ? true : false, //Para saber si se trata de un admin
        productsQuantityInUserCart : await cartsService.countProductsInCart(user.user.cart),
      }
      //console.log('SesionData: ',res.locals.sessionData )
        next();
  })(req, res, next)
}




function blockRoleAccessMiddleware(blockedRole) {
//Mira el currentUser y segun su role hago next a la siguiente solicitud o no.
  return (req, res, next) => {
     
  //console.log(`Entro a blockMiddleware con parametro ${blockedRole}`,req.currentUser)

    if (req.currentUser.role == blockedRole) {
      return next(new UnauthorizedError(UnauthorizedError.INVALID_ROLE, `Los usuarios con el rol ${blockedRole} no pueden realizar esta función...`));
    }
    next()
  }
}

//Permite solo continuar a los roles de usuario que estan en lista
function allowAccessRolesMiddleware(allowedRolesList) {
  //Mira el currentUser y si su rol no esta en la lista salgo desviando a handlererrormiddleware, de lo contrario lo dejo continuar.
    return (req, res, next) => {
      if (!allowedRolesList.includes(req.currentUser.role)) {
        return next(new UnauthorizedError(UnauthorizedError.INVALID_ROLE, `Los usuarios con rol ${req.currentUser.role} no tienen acceso a esta funcionalidad...`));
      }
      next()
    }
  }






//Simplemente mira si hay un token, si hay lo mete a propiedad req.currentUser y a true
function verifyTokenMiddleware(req,res,next){
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) { 
      //Si hay un error por parte de passport vamos al manejador de errores.
      return next(new TokenVerificationError.GENERIC_ERROR, err.message)
    }
    //No hay usuario
    if (!user) { 
      //No hay user se sigue normal, pues el middleware authMiddleware se encarga de rechazar rutas sin user logueados.
      //console.log('Se ejecuto verifyTokenMiddleware y no encontro user: ')
      next() 
        //Ewcordar que cuando a travez de next enviamos una intancia de Error o heredada, salta todos los middlewares que no contienen el parametro error y va a parar al primero que tenga el parametro error.

    }
    else{
      //Si hay un usuario con credenciales validas adjunto al objeto req esos datos en una propiedad para tenerlo a mano.
      req.currentUser = user.user
      req.isAuthenticated = true //Lo vamos a usar para las plantillas cuando borremos infoUserFromToken y estandaricemos.
      //De este modo tengo los datos del user activo.
    next()
     //Luego mediente roleMiddleware (que viene luego de este authMiddleware concedo o deniego acceso segun rol)

    }
   
})(req, res, next)
}

function authMiddleware(req,res,next){
  //Va a mirar si en req hay currentUser y propiuedad authenticated... si hay,deja continuar, 
  //Si no hay nos envia a error xq se intentaria avanzar a una ruta protegida
  if (req.isAuthenticated) next()
  else  return next(new UnauthorizedError(UnauthorizedError.NO_USER, 'No hay usuario con sesión iniciada/token valido...'));
}

export {verifyTokenMiddleware,authMiddleware,allowAccessRolesMiddleware,blockRoleAccessMiddleware,infoUserFromToken}




