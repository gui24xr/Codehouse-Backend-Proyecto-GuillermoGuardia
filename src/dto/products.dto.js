
import { IncompleteFieldsError } from "../services/errors/custom-errors.js"
import { getMissingFields } from "../utils/helpers.js"
import { ProductDTOERROR } from "../services/errors.service.js"

export class ProductDTO{

    constructor(receivedProduct){

        
        if (!receivedProduct) throw new Error('No se recibieron productos')
        
        
        if(process.env.database == 'mongo') {

            //En mongo tienen que venir los siguientes campos.
            const requiredFields = ['_id','title','description','price','img','code','category','owner','stock','status','thumbnails']
            const missingFields = getMissingFields(receivedProduct,requiredFields)
            //console.log(missingFields)
            //if (missingFields.length > 0) throw new IncompleteFieldsError('Faltan campos...')
                //missingFields da problema si el campo es null, corregirlo luego.
            
            this.productId = receivedProduct._id,
            this.title = receivedProduct.title,
            this.description = receivedProduct.description,
            this.price = receivedProduct.price,
            this.img = receivedProduct.img,
            this.code = receivedProduct.code,
            this.category = receivedProduct.category,
            this.owner = receivedProduct.owner,
            this.stock = receivedProduct.stock,
            this.status = receivedProduct.status,
            this.thumbnails = receivedProduct.thumbnails

        }

        //Supuesta caso de uso de firebase, queda a implementar aun.
        if(process.env.database == 'firebase') {
         
            //Logica para firebase
        }

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
