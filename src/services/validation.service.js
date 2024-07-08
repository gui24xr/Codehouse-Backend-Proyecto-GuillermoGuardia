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

     
        static getMissingFields(oneObject,requiredFieldsArray,functionName){
            //Retorna una lista con los campos faltantes.
            const missingFields = []
            // Verificar qué campos faltan
            for (const field of requiredFieldsArray) {
                if (!oneObject[field]) {
                    missingFields.push(field);
                }
            }
            
            return missingFields
        
        }

    //Chequea que una lista de productos tenga el formato esperado
    //Las productList recibidds deben tener formato [{productId:'dgdggd', quantity:323}]
    static isAValidProductsList(productsList,functionName){
        console.log('Products', productsList)
        //1- Probamos que sea un array,
        if (!(Array.isArray(productsList))) throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_LISTS,functionName,`No se ingreso una lista valida.`)
        if (productsList.length < 1) throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_LISTS,functionName,`Se ingreso una lista de productos vacia, no hay nada para agregar al carrito...`)

        let count = 0
        for (const item of productsList){

            if(!item.hasOwnProperty('productId'))          
                throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_LISTS,functionName,`El elemento ${count} de la lista no tiene la propiedad productId...`)

            if(!item.hasOwnProperty('quantity'))          
                throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_LISTS,functionName,`El elemento ${count} de la lista no tiene la propiedad quantity...`)

            if(!typeof(item.productId)=='string')          
                throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_LISTS,functionName,`La propiedad productId del elemento ${count} de la lista no es un string...`)

          
            if(!typeof(item.quantity)=='number')            
                throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_LISTS,functionName,`La propiedad quantity del elemento ${count} de la lista no es un numero...`)

            if(!(item.quantity >= 1))     
                throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_LISTS,functionName,`El elemento ${count} de la lista tiene quantity cantidad menor a cero , no se procedera...`)
            
            count++
        
        }
        
        }

      
        static checkProductItem(productItem,functionName){
            //Chequeamos que el producto tenga los campos minimos necesarios y que no tenga campos innecesarios.
              
            //Estos son los campos minimos requeridos. Status no nos preocupa, luego se seteara al cargarse.
            const invalidFieldsList = []
            const requiredFields = ['title','description','price','img','category','stock','thumbnails']
            const missingFieldsList = this.getMissingFields(productItem,requiredFields) 
            if (missingFieldsList.length > 0) throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_ITEM,functionName,`Faltan los siguientes datos para ingresar producto: ${missingFieldsList}.`)
            
            //Ya sabemos que tiene las propiedades, ahora corroboramos los tipos de datos y metemos los erroneos en una lista.
            if(typeof(item.title) !== 'string') invalidFieldsList.push('title')
            if(typeof(item.title) !== 'string') invalidFieldsList.push('description')    
            if(typeof(item.price) !== 'number') invalidFieldsList.push('price')     
            if(typeof(item.img) !== 'string') invalidFieldsList.push('img') 
            if(typeof(item.category) !== 'string') invalidFieldsList.push('category') 
            if(typeof(item.stock) !== 'number') invalidFieldsList.push('stock')   
            if (!Array.isArray(item.thumbnails)) invalidFieldsList.push('thumbnails')
            for (let i = 0; i < item.thumbnails.length; i++) {
                 if (typeof item.thumbnails[i] !== 'string') {
                     invalidFieldsList.push('thumbnails') 
                     break
                    }
                }

            //AHora finalmente si la lista de invalidFields tiene elementos es xq hay algun tipo de dato no valido.
            if (invalidFieldsList.length > 0) throw new InputValidationServiceError(InputValidationServiceError.INVALID_PRODUCT_ITEM,functionName,`Hay tipos de datos invalidos en los campos: ${invalidFieldsList}.`)
            
            //De esta manera validamos cada producto.
        }
    }
        
    

    
    
    
