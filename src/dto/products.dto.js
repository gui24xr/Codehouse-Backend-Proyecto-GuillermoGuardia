

import { ProductDTOERROR } from "../services/errors.service.js"

export class ProductDTO{

    constructor(receivedProduct){
        //Debe recibir un producto con las propiedades detalladas.
        this.productId = receivedProduct.productId;
        this.brand = receivedProduct.brand || 'S/Marca.';
        this.title = receivedProduct.title;
        this.description = receivedProduct.description|| 'S/Descripcion.';
        this.price = receivedProduct.price;
        this.img = receivedProduct.img;
        this.code = receivedProduct.code;
        this.category = receivedProduct.category;
        this.owner = receivedProduct.owner;
        this.stock = receivedProduct.stock;
        this.status = receivedProduct.status;
        this.purchasesCount = receivedProduct.purchasesCount;
        this.createdAt = receivedProduct.createdAt || 'S/Fecha Creacion';
        this.thumbnails = receivedProduct.thumbnails;
        
          
       
    }
}
