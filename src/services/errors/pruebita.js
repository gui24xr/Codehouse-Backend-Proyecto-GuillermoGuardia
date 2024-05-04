
/*trohw siempre detiene la ejecucion???
throw lanza objetos y/o expresiones??
esas expresiones las puedo capturar siempre en bloques try catch?
lo que lanza throw lo puedo acceder a travez del parametro de catch??
*/


function ingresarNombre(nombre){
    
    if (nombre != ('guillermo' || 'Guillermo')) throw 'Queria que ingreses Guillermo...'
    else {
        console.log('Seguimos la app xq ingresaste guillermo..')
    }
}


try{
    ingresarNombre('Juan')
}catch(error){
    console.log(error)
}
