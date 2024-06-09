//Recibe un objeto, un array con las propiedades que debemos tener
//Devuelve un array con las propiedades faltantes
//usamos su length para saber si vinieron o no, todas las propiedades
function getMissingFields(oneObject,requiredFieldsArray){

    const missingFields = []
    // Verificar qué campos faltan
    for (const field of requiredFieldsArray) {
        if (!oneObject[field]) {
            missingFields.push(field);
        }
    }
    console.log(missingFields)
    return missingFields
}


function isEmail(email) {
    // Expresión regular para validar un email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


export {getMissingFields,isEmail}