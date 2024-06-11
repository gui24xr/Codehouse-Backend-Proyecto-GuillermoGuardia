import { UserDTOERROR } from "../../services/errors.service.js"

//Esto traerlo de variables de entorno a futuro. Cada app puede permitir distintos tipos de roles.
export const rolesList = ['user','admin','premium']


export function getMissingFields(oneObject,requiredFieldsArray){
    const missingFields = []
    for (const field of requiredFieldsArray) {
        if (!oneObject[field]) missingFields.push(field)
    }
    //console.log(missingFields)
    return missingFields
}


export function getInvalidFieldsList(receivedObject) {
    const invalidFieldsList = [];
    //if ('userId' in receivedObject && typeof receivedObject.userId !== 'string') invalidFieldsList.push('userId');
    if ('email' in receivedObject && !isEmail(receivedObject.email)) invalidFieldsList.push('email');
    if ('password' in receivedObject && typeof receivedObject.password !== 'string') invalidFieldsList.push('password');
    if ('firstName' in receivedObject && typeof receivedObject.firstName !== 'string') invalidFieldsList.push('firstName');
    if ('lastName' in receivedObject && typeof receivedObject.lastName !== 'string') invalidFieldsList.push('lastName');
    if ('age' in receivedObject && typeof receivedObject.age !== 'number') invalidFieldsList.push('age');
    if ('role' in receivedObject && !rolesList.includes(receivedObject.role)) invalidFieldsList.push('role');
    //if ('cartId' in receivedObject && receivedObject.cartId !== null && typeof receivedObject.cartId !== 'string') invalidFieldsList.push('cartId');

    return invalidFieldsList;
}



//Deveulve true o false si la cadena ingresada es un email.
function isEmail(email) {
// Expresión regular para validar un email
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return regex.test(email);
}
