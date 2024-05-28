import { CartRepository } from "../repositories/cart.repositories.js";
import { UsersRepository } from "../repositories/users.repositories.js";
const cartsRepository = new CartRepository()
const usersRepository = new UsersRepository()
import passport from "passport";
import { UnauthorizedError } from "../services/errors/custom-errors.js";


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
      if (err) { return next(err); }
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
        productsQuantityInUserCart : await cartsRepository.countProductsInCart(user.user.cart),
      }
      //console.log('SesionData: ',res.locals.sessionData )
        next();
  })(req, res, next)
}




async function middlewareCurrent(req,res,next){
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) { return next(err); }
    //No hay usuario
    if (!user) { 
       //Si no hay user porque no es valido o nunca inicio sesion entonces va al middleware manejador de errores
       //Ewcordar que cuando a travez de next enviamos una intancia de Error o heredada, salta todos los middlewares que no contienen el parametro error y va a parar al primero que tenga el parametro error.
       return next(new UnauthorizedError(UnauthorizedError.INVALID_CREDENTIALS,'Credenciales invalidas, Accedo denegado...'))
    }
    else{//Hay user y es admin
      if (user.user.role == 'admin'){
      //A travez de req envio datos a la ruta current
      req.user = user.user
     next();
  }
  else{ 
    res.status(500).send('El usuario no es un administrador')
  }

    }
   
})(req, res, next)
}


function authMiddleware(req,res,next){
  //Va a mirar si en req hay currentUser y propiuedad authenticated... si hay,deja continuar, 
  //Si no hay nos envia a error xq se intentaria avanzar a una ruta protegida
  if (req.isAuthenticated) next()
  else  return next(new UnauthorizedError(UnauthorizedError.NO_USER, 'No hay usuario con sesión iniciada...'));
}


function blockRoleAccessMiddleware(blockedRole) {
//Mira el currentUser y segun su role deja pasar o manda a

 
  return (req, res, next) => {
     
  console.log(`Entro a blockMiddleware con parametro ${blockedRole}`,req.currentUser)
    if (!req.currentUser) {
      return next(new UnauthorizedError(UnauthorizedError.NO_USER, 'No hay usuario con sesión iniciada...'));
    }
    if (req.currentUser.role == blockedRole) {
      return next(new UnauthorizedError(UnauthorizedError.INVALID_ROLE, `Los usuarios con el rol ${blockedRole} no pueden realizar esta función...`));
    }
    next();
  };
}






//Simplemente mira si hay un token, si hay lo mete a propiedad req.currentUser y a true
function verifyTokenMiddleware(req,res,next){
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) { 
      //Si hay un error por parte de passport vamos al manejador de errores.
      //Recordar darle tipo de instancia mas luego para manejarlo correctamente.
      //Esto seria un passport error y graVE
      return next(err) 
    }
    //No hay usuario
    if (!user) { 
      console.log('Se ejecuto verifyTokenMiddleware y no encontro user: ')
      next() //No hay user se sigue normal
       //Si no hay user porque no es valido o nunca inicio sesion entonces va al middleware manejador de errores
       //Ewcordar que cuando a travez de next enviamos una intancia de Error o heredada, salta todos los middlewares que no contienen el parametro error y va a parar al primero que tenga el parametro error.
       //return next(new UnauthorizedError(UnauthorizedError.INVALID_CREDENTIALS,'Credenciales invalidas, Accedo denegado...'))
    }
    else{
      //Si hay un usuario con credenciales validas adjunto al objeto req esos datos en una propiedad para tenerlo a mano.
      req.currentUser = user.user
      req.isAuthenticated = true
      //De este modo tengo los datos del user activo.
    next()
     //Luego mediente roleMiddleware (que viene luego de este authMiddleware concedo o deniego acceso segun rol)

    }
   
})(req, res, next)
}

export {verifyTokenMiddleware,authMiddleware,blockRoleAccessMiddleware,infoUserFromToken,middlewareCurrent}




