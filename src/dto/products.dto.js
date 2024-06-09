
import { IncompleteFieldsError } from "../services/errors/custom-errors.js"
import { getMissingFields } from "../utils/helpers.js"

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