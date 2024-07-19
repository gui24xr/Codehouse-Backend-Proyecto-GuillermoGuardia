import { ProductsRepository } from "../repositories/products-repositories.js";
import { ProductsServiceError, ProductDTOERROR} from "./errors.service.js";
import { UsersService } from "./users.service.js";

const productsRepository = new ProductsRepository()

export class ProductsService{

    async findProducts({limit,page,orderBy,orderField,productId,owner,status,code,brand,category,createdBefore,createdAfter,priceMin,priceMax,purchasesCountMin,purchasesCountMax}){
        try{
          //Pasamos por la etapa de validacion.
          //Le pedimos al repositorio de productos que arme la busqueda.
          //Pero aplica las reglas del negocio.

          //console.log('En service: ',{limit,page,orderBy,orderField,productId,owner,status,code,brand,category,createdBefore,createdAfter,priceMin,priceMax,purchasesCountMin,purchasesCountMax})
            const searchResult = await productsRepository.findProducts({
                limit: limit || 10,
                page: page || 1,
                orderBy: orderBy || -1,
                orderField: orderField || 'category',
                productId,
                owner,
                status,
                code,
                brand,
                category,
                createdBefore,
                createdAfter,
                priceMin,
                priceMax,
                purchasesCountMin,
                purchasesCountMax
            })

            //Obtenemos el objeto con toda la consulta y devolvemos 
            return searchResult
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.findProducts|','Error interno del servidor...')
        }
    }


        /*IMPORTANTE PEDIRLE AL SERVICIO DE CARROS QUE BORRE DE SUS CARROS EL PRODUCTID BORRADO*/
    async deleteProduct(productId){
        //Le pide al repositorio que haga borrar el productID y devuelve lo borrado al cliente
        try{
            const deleteResult = await productsRepository.deleteProductsList([productId])
            return deleteResult[0] //COmo envie a borrar 1, tomo el primer elemento, si hay un problema se va a catch x implementacion de epositorio..
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.deleteProduct|','Error interno del servidor...')
        }
    }


    async createProduct({email,brand,title,description,price,img,code,category,stock,status,thumbnails}){
        //Pedimos al repo la creacion de un produco usando su metodo createProducstList.
        try{
            //Pasamos por la capa de validacion

            //Pasada la etapa de validacion   
            const productOwner = email ||  'admin'  //Si es admin dira admin, si es premium dira su email♫
            //Verifico que el rol de usuario sea 'premium', de lo contrario no puede agregar productos.
           
           /*
            const usersService = new UsersService()
            const searchedUser = await usersService.getUserByEmail(email)
            if (!(searchedUser.role == 'premium')) throw new ProductsServiceError(ProductsServiceError.CREATE_ERROR,'|ProductsService.createProduct|',`El usuario ${productOwner} no tiene permisos para agregar productos ya que se necesita ser user premium y el user es ${searchedUser.role}...`)
                //console.log(searchedUser)
            */
            //Busco que para el owner no exista un producto con el mismo codigo. Si existe, lanzo excepcion.
            const productsList = await productsRepository.getProducts({owner:productOwner,code:code})
            //COmo get products devuelve null si no hay coincidencias
            if (productsList.length>0) throw new ProductsServiceError(ProductsServiceError.CREATE_ERROR,'|ProductsService.createProduct|',`Ya existe un producto con el codigo ${code} para el usuario ${productOwner}...`)
            
         
            //Si todo salio OK se procede a crear el producto.
            const createListResult = await productsRepository.createProducts([{
            brand:brand, 
            title:title,
            description: description || 'Producto sin descripcion.',
            price: price,
            img: (img && regexImg.test(img)) ? img : '/img/products/defaultproduct.png',
            code: code,
            category: category,
            owner: productOwner,
            stock: stock,
            status : status,
            thumbnails: (thumbnails && thumbnails.every(item => regexImg.test(item))) || ['/img/products/defaultproduct.png','/img/products/defaultproduct.png','/img/products/defaultproduct.png','/img/products/defaultproduct.png'] 
            }])

            //Como solo envie a crear uno devuelvo siempre y cuando se haya creado, si no, entra la excepcion por la implementacion del repositorio.
            if(createListResult.length > 0){
                return createListResult[0] 
            } 
                else {
                    return []
                }
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.createProduct|','Error interno del servidor...')
        }
    }
    


    async createProductsGroup(email,productsList){
        //Toma una lista de productos con parametros, la mapea y le pide al repositorio que la cree.
        //Previamanete los datos pasan por capa de validacion.
        //Revisa que en toda la lista no hay codigos repetidos en lista ni para el mismo user en la BD.
        //Solo los user premium pueden agregar productos.
        //Una vez que todo eso esta OK, procede a agregarlos
        try{
            //Pasada la etapa de validacion   
            const productOwner = email ||  'admin'  //Si es admin dira admin, si es premium dira su email♫
            
            //Verifico que el rol de usuario sea 'premium', de lo contrario no puede agregar productos.
           /*
            const usersService = new UsersService()
            const searchedUser = await usersService.getUserByEmail(email)
            if (!(searchedUser.role == 'premium')) throw new ProductsServiceError(ProductsServiceError.CREATE_ERROR,'|ProductsService.createProduct|',`El usuario ${productOwner} no tiene permisos para agregar productos ya que se necesita ser user premium y el user es ${searchedUser.role}...`)
            //console.log(searchedUser)
           */ 


            //Pido al repositorio que me de todos los codigos de producto de ese user.
            const codesProductsListInDB = await productsRepository.getCodesListByOwner(productOwner)
            //Reviso que en la lista no exista ningun codigo de la lista recibida.
            //Formo un conjunto con todos los codigos de la lista nueva y otro con los de la BD.
         
            const regexImg = /\.(jpg|jpeg|png|gif)$/i;
            //Mapeo y comparo con la base de datos los codigos del user.
            //Estos seran los productos  agregar, tambien les agrego las reglas de negocio.
            const listOfNewProducts = productsList.map(product => {
                if (!codesProductsListInDB.includes(product.code)) {
                        return {
                        brand:product.brand, 
                        title:product.title,
                        description: product.description || 'Producto sin descripcion.',
                        price: product.price,
                        img: (product.img && regexImg.test(product.img)) ? product.img : '/img/products/defaultproduct.png',
                        code: product.code,
                        category: product.category,
                        owner: productOwner,
                        stock: product.stock,
                        status : product.status,
                        thumbnails: product.thumbnails || ['/img/products/defaultproduct.png','/img/products/defaultproduct.png','/img/products/defaultproduct.png','/img/products/defaultproduct.png'] 
                    }
            }
                
            })

          //const listaDefinitiva = listOfNewProducts.filter(item => item != null)
          //console.log(listaDefinitiva)
          //Ya tengo los productos que no se deben agregar pero con null, null lo borro al mandarlos.
         const createdProducts =  await productsRepository.createProducts(listOfNewProducts.filter(item=>item!=null))
       
          //Retorno un objeto con los agregados y no agregados.
          return {
            newProducts:createdProducts || [],
            existProducts: codesProductsListInDB
          }

        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.createProductsGroup|','Error interno del servidor...')
        }
        }



        async editProduct({email,productId,brand,title,description,price,img,code,category,stock,status,thumbnails}){
            try{
                const updateInfo = {}
                //Pasamos por la capa de validacion.

                //1- Existe el producto? Obtengo el objeto
                const productsList = await productsRepository.getProducts({productId:productId})
                if (!productsList) throw new ProductsServiceError(ProductsServiceError.PRODUCT_NO_EXIST,'ProductsService.editProduct',`No se puede actualizar el producto productId ${productId} ya que el mismo no existe.`)
                const searchedProduct = productsList[0]
                
                updateInfo.productId=searchedProduct.productId
                //Miro campo por campo que voy a actualizar.
                //2.1 Codigo
               
                if (code && (searchedProduct.code != code)){
                    //SI no es el mismo codigo, mira que el nuevo codigo no este entre los codigos del user.
                    const listOfCodesInDB = await productsRepository.getCodesListByOwner(searchedProduct.owner)
                    //Si el codigo esta repetido en el owner lanzo error, si no, agrego el code al objeto e actualizacion
                    if (listOfCodesInDB.includes(code)) throw new ProductsServiceError(ProductsServiceError.PRODUCT_WITH_SAME_CODE_ALREADY_EXIST,'ProductsService.editProduct',`No se puede actualizar el producto productId ${productId} ya que otro producto tiene el codigo del usuario ${code}.`)
                    else updateInfo.code = code
                }
                

                //2.2 Campos que son string. Vigilar que no sean nulos ni otros topos de dato
                if(brand && (searchedProduct.brand != brand) && (brand != '') && (typeof(brand)=='string')) updateInfo.brand = brand
                if(title && (searchedProduct.title != title) && (title != '') && (typeof(title)=='string')) updateInfo.title = title
                if(category && (searchedProduct.category != category) && (category != '') && (typeof(category)=='string')) updateInfo.category = category;
                if(description && (searchedProduct.description != description) && (description != '') && (typeof(description)=='string')) updateInfo.description = description;

                //El campo imagen lo mismo que los string, pero si es un string vacio ponemos el string de producto x defaul
                
                //OJO ESTA LINEA ESTA BORRANDO IMAGENES
                //if(img && (searchedProduct.img != img) && (img != '') && (typeof(img)=='string')){} updateInfo.img = '/img/products/defaultproduct.png'
                
                
                
                
                //Thumbnails comprobamos que sea array, que sean 4 a lo sumoy comparo con el array original
                const arraysAreEqual = (arr1, arr2) => {
                    if (arr1.length !== arr2.length) return false  // Primero, comprobamos si tienen la misma longitud
                    for (let i = 0; i < arr1.length; i++) { if (arr1[i] !== arr2[i]) return false}
                    return true;
                }

                const regexImg = /\.(jpg|jpeg|png|gif)$/i;
                if (thumbnails) {
                    //Vino thubnail pero no es array.
                    if(!Array.isArray(thumbnails)) throw new ProductsServiceError(ProductsServiceError.UPDATING_ERROR,'ProductsService.editProduct','Dato invalido parta thumbnails, no se un array !')
                    else{
                    // Comparación de arrays con la función arraysAreEqual
                    if (!arraysAreEqual(thumbnails, searchedProduct.thumbnails)) {
                        
                    //Miro que sea menor de 6 posiciones
                    if (thumbnails.length >= 6) throw new ProductsServiceError(ProductsServiceError.UPDATING_ERROR,'ProductsService.editProduct','Dato invalido parta thumbnails, se cargaron mas de 5 thubnails !')
                        
                    //Todos son string miro que sean imagen  y si no lo son los seteo a img.
                    //if(!thumbnails.every(item => typeof(item) == 'string') 
                        // Ya que son diferentes, ajustamos los thumbnails
                    const nuevoThumbnails = thumbnails.map(item => {
                        if (!regexImg.test(item)) return '/img/products/defaultproduct.png';
                        else return item;
                    })
                        while(nuevoThumbnails.length < 5) nuevoThumbnails.push('/img/products/defaultproduct.png')
                        updateInfo.thumbnails = nuevoThumbnails
                    }
                 
                    }
                }

                //Revisar esta logica.
                if(status && (searchedProduct.status != status)) updateInfo.status = status
                if(price && (searchedProduct.price != price)){
                    updateInfo.price = price
                    price <= 0 && (updateInfo.status = false) //Si el precio se pone a cero desactivamos el producto obligadamente.
                }
                
                if(stock && (searchedProduct.stock != stock)){
                    updateInfo.stock = stock
                    stock <= 0 && (updateInfo.status = false) //Desactivo el prpoductio
                } 
            
                //console.log('UpdateInfo: ',updateInfo)
                //Finalmente le mandamos al repositorio los datos para procesar en la BD.

                const updatedProduct = await productsRepository.editProducts([{...updateInfo}])
                //console.log(searchedProduct)
                return updatedProduct
            }catch(error){
                if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
                else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.editProduct|','Error interno del servidor...')
            }
        }
    


    async getProductsCategories(){
        try{
            const categories = await productsRepository.getProductsCategoriesList()
            return categories
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.getProductsCategories|','Error interno del servidor...')
        }
    }



    async getProductById(productId){
        //Devuelvo el producto unico y si no existe devuelvo null
        try{
            //Como solo obtendre un producto y para que sea mas eficiente le pido al repo con limit=1
            const searchedProduct = await productsRepository.getProducts({productId})
            //Si existe el producto estara su dto en el array producctQueryList y sera el primero
            if (searchedProduct.length > 0) return searchedProduct[0] 
            else return null
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.getProductById|','Error interno del servidor...')
        }
    }



    async updateProductStock(productId,newStock){
        //Updatea el productID en la cantidad newStock.
        try{
           await this.editProduct({productId:productId,stock:newStock})
        }catch(error){
            if (error instanceof ProductsServiceError || error instanceof ProductDTOERROR) throw error
            else throw new ProductsServiceError(ProductsServiceError.INTERNAL_SERVER_ERROR,'|ProductsService.updateProductById|','Error interno del servidor...')
        }
    }


   

}
