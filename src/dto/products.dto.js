

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


export class ProductConstructionObject {
    constructor(productData) {
        const requiredFields = ['title', 'description', 'price', 'img', 'code', 'category', 'stock', 'status']
        const missingFields = getMissingFields(productData,requiredFields)
        if (missingFields.length > 0) throw ProductDTOERROR(ProductDTOERROR.MISSING_FIELDS,'|ProductoConstructionObject.constructor|',`|Faltan ingresar los campos : ${missingFields}|`)
        // Destructuramos el objeto productData para asignar propiedades
        const {
            title,
            description,
            price,
            img,
            code,
            category,
            owner,
            stock,
            status,
            thumbnails
        } = productData;



        this.title = title;
        this.description = description;
        this.price = price;
        this.img = img;
        this.code = code;
        this.category = category;
        this.owner = owner || 'admin';
        this.stock = stock;
        this.status = status;
        this.thumbnails = thumbnails;
    }
}
