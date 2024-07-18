
import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";



import passport from "passport";
import { UnauthorizedError, TokenVerificationError } from "../services/errors.service.js";


 //Ewcordar que cuando a travez de next enviamos una intancia de Error o heredada, salta todos los middlewares que no contienen el parametro error y va a parar al primero que tenga el parametro error.



 //Simplemente mira si hay un token, si hay lo mete a propiedad req.currentUser.
function getUserFromTokenMiddleware(req,res,next){
  //console.log('Middleware: ','getUserFromTokenMiddleware')
passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) {
     return next(new TokenVerificationError.GENERIC_ERROR, err.message)  //Si hay un error por parte de passport vamos al manejador de errores.
    }
    if (!user) { 
      return next() //No hay user se sigue normal, pues el middleware authMiddleware sera encargado de rechazar rutas sin user logueados.
    }
    else{
      //Si hay un usuario con credenciales validas adjunto al objeto req esos datos en una propiedad currentUser para tener los datos del user logueado.
      //Luego mediente roleMiddleware (que viene luego de este authMiddleware concedo o deniego acceso segun rol)
     //console.log('usuario en token: ', user)
      req.currentUser = user.user 
      next()
  }
})(req, res, next)
}





 function onlyAuthUsers(req,res,next){
  //console.log('Middleware: ','onlyAuthUsers')
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) {
     return next(new TokenVerificationError.GENERIC_ERROR, err.message)  //Si hay un error por parte de passport vamos al manejador de errores.
    }
    if (!user) { 
      next(new UnauthorizedError(UnauthorizedError.NO_USER, 'No hay usuario con sesión iniciada/token válido.'));
    }
    else{
      req.currentUser = user.user 
      next()
  }
})(req, res, next)
}

/*
function onlyAuthUsers(req,res,next){
  console.log('Middleware: ','onlyAuthUsers')
  if (!req.currentUser) {
    return next(new UnauthorizedError(UnauthorizedError.NO_USER, 'No hay usuario con sesión iniciada/token válido.'));
  }
  next();
}*/

//Es para bloquear rutas cuando existe un user con token, ejemplo, no se puede ir a login si ya un user con token.
function onlyWithoutAuthToken(req,res,next){
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) 
      return next(new TokenVerificationError.GENERIC_ERROR, err.message)  //Si hay un error por parte de passport vamos al manejador de errores.
    if (!user)
       next()
    else{
      next(new UnauthorizedError(UnauthorizedError.USER_LOGGED_EXIST, 'Hay usuario con sesión iniciada/token válido. Cerrar sesion para poder ingresar con otro usuario...'))
    }
     
})(req, res, next)
}



function blockRoleAccessMiddleware(blockedRole) {
  return function(req, res, next) {

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      if (err) {
        return next(new TokenVerificationError.GENERIC_ERROR, err.message);
      }
      if (!user) {
        next(); //ACA ERROR X NO HABER USER
      } else {
        //ACA SE ABRE EN 2.
        if (user.user.role == blockedRole){
          //console.log('NO SE PUEDE AVANZAR y lanzare error')
          next(new UnauthorizedError(UnauthorizedError.INVALID_ROLE, `Los usuarios con rol ${blockedRole} no tienen acceso a esta funcionalidad...`))
        }
        else next()
      }
    })(req, res, next);
  };
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






export {onlyAuthUsers,onlyWithoutAuthToken,getUserFromTokenMiddleware,allowAccessRolesMiddleware,blockRoleAccessMiddleware}




