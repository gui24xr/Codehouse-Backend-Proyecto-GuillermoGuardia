/* Este servicio se va a encargar de validar datos en toda la aplicacion, ya sea de...
  
    * Controlar campos necesarios
    * Controlar que los valores sean correctos.
    
    Si faltaran campos o hubiesen valores no correspondientes lanzara una instancia de error.
*/
//-----------------------------------------------------------------------------------------




//Deveulve true o false si la cadena ingresada es un email.





//-----------------------------------------------------------------------------------------
import { InputValidationServiceError } from "./errors.service.js";

export class InputValidationService{



    static isValidRole(role,functionName) {
        // Expresión regular para validar un email
        const allowsRoles = ['admin','user','premium']
        if (!allowsRoles.includes(role)) throw new InputValidationServiceError(InputValidationServiceError.INVALID_VALUES,functionName,`${role} no es un valor valido para el dato Rol de usuario.`)
      }


    static isEmail(email,functionName) {
        // Expresión regular para validar un email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) throw new InputValidationServiceError(InputValidationServiceError.INVALID_VALUES,functionName,`${email} no es un email valido.`)
      }

    
    //Chequea que un objeto traiga todas las propiedades necesarias.
    static checkRequiredField(oneObject,requiredFieldsArray,functionName){

        const missingFields = []
        // Verificar qué campos faltan
        for (const field of requiredFieldsArray) {
            if (!oneObject[field]) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) throw new InputValidationServiceError(InputValidationServiceError.INCOMPLETE_FIELDS,functionName,`Dato/s incompleto/s ! El/los campos ||${missingFields}|| es/son requeridos.`)
    }
    
    
}