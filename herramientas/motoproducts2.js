import { MOTO_PRODUCTS } from "./arraymotoproducts.js";
import { faker } from "@faker-js/faker";
import fs from 'fs'
const getRandomInt = (max) => {
    // Asegurar que max sea al menos 1
    max = Math.max(1, max);
    return Math.floor(Math.random() * (max - 1)) + 1;
  }
  

  const brandsMap = {
    'agv': 'Agv',
    'alpinestars': 'Alpinestars',
    'dainese': 'Dainese',
    'shark': 'Shark',
    'arai': 'Arai',
    'airoh': 'Airoh',
    'shoei': 'Shoei',
    'nolan': 'Nolan',
    'hjc': 'HJC',
    'bell': 'Bell',
    'nitro': 'Nitro',
    'scorpions': 'Scorpions',
    'oneal': 'Oneal',
    'rjays': 'Rjays',
    'nelson': 'Nedson',
    'ohio': 'Ohio',
    'oxford': 'Oxford',
    'merlin': 'Merlin',
    'macna': 'Macna',
    'ixon': 'Ixon'
  };
  
  // Función para encontrar la marca basada en item.description
  function findBrand(description) {
    const lowerDesc = description.toLowerCase(); // Convertir a minúsculas para ser case-insensitive
    
    for (let key in brandsMap) {
      if (lowerDesc.includes(key)) {
        return brandsMap[key]; // Devuelve la marca correspondiente
      }
    }
    
    return 'generic'; // Si no se encuentra ninguna marca, devolver 'generic'
  }
  
const parsearCadena = (cadena) => {
    const numeroString = cadena.replace(/\$|\s/g, '');
    return parseFloat(numeroString)
}

const NUEVO_ARRAY = MOTO_PRODUCTS.map(item => {

    const generatedStock = getRandomInt(500)
    let brandName =' generic'

    
    return{
        brand: findBrand(item.description),
        title: item.productName,
        description: item.description,
        price: parsearCadena(item.productPrice),
        img: item.imageSrc,
        code: faker.random.alphaNumeric(8),
        category: item.category,
        owner: `premium${getRandomInt(4)}@gmail.com`,
        stock: getRandomInt(500),
        status: generatedStock > 0 ? true : false,
        thumbnails:[item.imageSrc,item.imageSrc,item.imageSrc,item.imageSrc]
    }
})


console.log(NUEVO_ARRAY)

fs.writeFileSync('unarchivo.json',JSON.stringify(NUEVO_ARRAY,null,2),'utf-8')