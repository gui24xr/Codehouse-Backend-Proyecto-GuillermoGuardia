/* Para construir este CARTDTO el receivedCart necesita un objeto con estas caracteristicas

Necesita un objeto que tenga 2 propiedades:
    1- cartId: El id del carro en la BD
    2- Products: Una lista de objetos la cual cada objeto tiene 2 campos:
{
            cartId: id producto en BD
            products: [{                
                    quantity: quantity producto en BD
                    product:{
                        productId : id del producto en BD
                        title: title producto en BD
                        description: descripcion producto en bd
                        price: precio en bd
                        img: string img producto en bd
                        code: codigo del producto en bd
                        category: categoria del producto en bd,
                        owner: owner de producto en BD
                        stock: stock del producto en BD
                        status: estado del producto en BD
                        thumbnails: array strings de thumbnails en bd
                        
                    }
                }]

    
     
 con toda esta informacion obtenida de una BD se construye una instancia de CartDTO
 Es util tener una clase para luego hacer validacione y que toda la aplicacion se maneje de una mismo forma
 sin importar que base de datos se usa. Estandarizamos los datos.

*/
export class CartDTO{
    constructor(receivedCart){
            this.cartId = receivedCart.cartId,
            this.products = receivedCart.products.map(item => ({
                quantity: item.quantity,
                product: item.product, // Esto a futuro podria usuarlo para hacer productDTO
                subtotal: (Number(item.quantity) * Number(item.product.price)).toFixed(2)
            
            }))
            this.countProducts = receivedCart.products.reduce((accumulator,productItem)=>{
                return accumulator + productItem.quantity
            },0)
            this.cartAmount = receivedCart.products.reduce((accumulator,productItem)=>{
                return accumulator + productItem.product.price * productItem.quantity
            },0)
       
    }
}