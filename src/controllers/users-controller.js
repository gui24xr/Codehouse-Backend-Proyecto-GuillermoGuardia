import { UsersService } from "../services/users.service.js";
import {
  IncompleteFieldsError,
  UsersServiceError,
} from "../services/errors.service.js";
import { getMissingFields } from "../utils/helpers.js";

const usersService = new UsersService();

export class UsersController {
  async createUser(req, res, next) {
    const { first_name, last_name, email, password, age, role } = req.body;
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "password",
      "age",
    ];
    const missingFields = getMissingFields(req.body, requiredFields);

    try {
      //Controlamos que no falten datos necesarios para crear un user....
      if (missingFields.length > 0)
        throw new IncompleteFieldsError(
          `Faltan ingresar los siguientes campos: ${missingFields}`
        );
      //SI Estan todos los campos necesarios entonces se procede...
      const createdUser = await usersService.createUser(
        first_name,
        last_name,
        email,
        password,
        age,
        role
      );

      res.status(201).json({
        status: "success",
        message: "El usuario ha sido creado correctamente.",
        user: createdUser,
      });
    } catch (error) {
      if (
        error instanceof IncompleteFieldsError ||
        error instanceof UsersServiceError
      )
        next(error);
      else {
        next(
          new UsersServiceError(
            UsersServiceError.INTERNAL_SERVER_ERROR,
            "|UsersControllers.createUser|",
            "Error interno del servidor..."
          )
        );
      }
    }
  }

  //Si autenticamos metemos al req el currentUser
  async authenticateUser(req, res, next) {
    console.log('fffffffffffffffffffffffffff')
    const { email, password } = req.body;
    const requiredFields = ["email", "password"];
    const missingFields = getMissingFields(req.body, requiredFields);
    try {
      //Controlamos que no falten datos necesarios para iniciar sesion...
      if (missingFields.length > 0)
        throw new IncompleteFieldsError(
          `Faltan ingresar los siguientes campos: ${missingFields}`
        );
      //SI Estan todos los campos necesarios entonces se procede...
      const authenticateUser = await usersService.authenticateUser(
        email,
        password
      );

      res.cookie(process.env.COOKIE_AUTH_TOKEN, authenticateUser.userToken, {
        signed: true,
        maxAge: 3600000,
        httpOnly: true,
      });

      res.status(200).json({
        status: "success",
        message: `El usuario ${authenticateUser.email} ha iniciado sesion correctamente...`,
        user: authenticateUser.userData,
      });
    } catch (error) {
      if (
        error instanceof IncompleteFieldsError ||
        error instanceof UsersServiceError
      )
        next(error);
      else {
        next(
          new UsersServiceError(
            UsersServiceError.INTERNAL_SERVER_ERROR,
            "|UsersControllers.authenticateUser|",
            "Error interno del servidor..."
          )
        );
      }
    }
  }

  async logout(req, res, next) {
    //Cierra la sesion del currentUser
    //Ejecuta el servicio de logout para elreq.currentUser por params al se cual se le setea last_connection
    //Si eso salio todo ok entonces invalida la cookie del token y setea las res que se usan para el render de plantillas
    const { userId, email } = req.currentUser;
    try {
      const updatedUser = await usersService.logout(userId);
      console.log("pase x aca : ", updatedUser);
      //Inavalidamos la cookie.
      res.clearCookie(process.env.COOKIE_AUTH_TOKEN); //Limpíamos la cookie.
      res.locals.sessionData.login = false; // Seteamos las variables de handbars
      //Enviamos respuesta
      res.status(201).json({
        status: "success",
        message: `El user ${email} cerro sesion !!`,
        hour: updatedUser.lastConnection,
      });
    } catch (error) {
      if (error instanceof UsersServiceError) next(error);
      else {
        next(
          new UsersServiceError(
            UsersServiceError.INTERNAL_SERVER_ERROR,
            "|UsersControllers.logout|",
            "Error interno del servidor..."
          )
        );
      }
    }
  }

  async currentRoute(req, res, next) {
    //Voy a tomar el currentUer que viene en middleware que extrae la data del token 'verifyTokenMiddleware'.
    //Hay currentuser? devuelvo la data
    //No hay currentUser? devuelvo 'No Hay currentUser'
    //Hay error en el middleware que extrae los datos del token? se va por catch al handler de errores.
    try {
      //console.log(req.currentUser)
      req.currentUser
        ? res.json({
            message: "Existe user con token activo...",
            user: req.currentUser,
          })
        : res.json({
            message: "No Existe user con token activo...",
          });
    } catch (error) {
      next(
        new UsersServiceError(
          UsersServiceError.INTERNAL_SERVER_ERROR,
          "|UsersControllers.currentRoute|",
          "Error interno del servidor..."
        )
      );
    }
  }
}
