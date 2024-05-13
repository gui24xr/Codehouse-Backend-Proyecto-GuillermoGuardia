/*
1- Recibe parametros:
    Objeto req.body
    Array con campos obligatorios
2- Procesa y devuelve un array con los campos faltantes.
 return {
    missingFields:[]
 }
 
 Lo usamos para saber si hay campos obligados no ingresados.
*/



function getMissingFields(bodyObject,requiredFieldsArray){

    const missingFields = []
    // Verificar qué campos faltan
    for (const field of requiredFieldsArray) {
        if (!bodyObject[field]) {
            missingFields.push(field);
        }
    }

    console.log(missingFields)
    return missingFields
}

export {getMissingFields}