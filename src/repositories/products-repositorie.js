


export class ProductsRepository{
     //Le pide a la capa de persistencia la creacion del carro vacio
    //Toma el carro creado y deveulve un CartDTO para uso de la capa service.
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async createProduct(){
        try{
          
        }catch(error){
            
        }
    }

    //Le pide a la capa de persistencia la un carrito por su id
    //Toma el carro obtenido y deveulve un CartDTO para uso de la capa service.
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async getProductById(cartId){
        try{
            
        }catch(error){
            
        }
    }

    //Le pide a la capa persistencia que agrege un productId en un cartId
    //Nuestros metodos de capa de persistencia solo agregan el carro x lo cual luego hay que obtenerlo
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async updateProduct(productDTOInstance){
        try{
            
        }catch(error){
           
    }

    //Le pide a la capa de persistencia actualice la cantidad del productId
    //Nuestros metodos de capa persistencia solo actualizan la cantidad x lo cual luego hay que obtenerlo
    //Pueden venir errores de DTO o de la capa de persistenia. Falta agregar el error de dto,
    async updateProductStock(productId,newStock){
        try{
           
        }catch(error){
            
        }
    }

    
    async deleteProduct(productId){
        try{
          
        }catch(error){
           
        }
    }
    
    

}