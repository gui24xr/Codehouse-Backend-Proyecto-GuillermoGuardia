import {faker} from '@faker-js/faker'



const generateOneProduct = () => {
    
    const randomId = Math.floor(Math.random() * 1000)
    const stock = parseInt(faker.string.numeric())
    const status = stock > 0 ? true : false
    const img = `https://picsum.photos/id/${randomId}/200/300`; // Devuelve la URL de la imagen
    const thumbnails = []
    thumbnails[1] = img
    thumbnails[2] = img
    thumbnails[3] = img

    return {
        id: faker.database.mongodbObjectId(), 
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        img:img,
        category: 'Fabricar generador de categorias',
        stock: stock,
        status:status,
        thumbnails:thumbnails
    }
}


const generateProducts = (requiredQuantity) => {
    let products = []
    for (let i = 0; i < requiredQuantity; i++ ) {
        const product = generateOneProduct()
        console.log(product)
        products.push(product);
    }
    return products
}


    /*
    return {
        id: faker.database.mongodbObjectId(), 
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        email: faker.internet.email(),
        productos
    }
*/

export {generateProducts}