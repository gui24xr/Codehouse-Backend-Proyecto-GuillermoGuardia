import { ExchangePointDTOERROR } from "../services/errors.service.js";


export class ExchangePointDTO{
    constructor(exchangePointObject){
        //Las validaciones se hacen mas tarde
        /*
        Necesitamos tener un objeto que tenga las propiedades:
        
        */
       this.exchangePointId = exchangePointObject.id
       this.type = exchangePointObject.type;
       this.pointName = exchangePointObject.pointName;
       this.receiver = {
        name : exchangePointObject.receiverName,
        lastName : exchangePointObject.receiverLastName
       };
       
       this.address = {
        phones: exchangePointObject.phones,
        locationType : exchangePointObject.locationType,
        street: exchangePointObject.street,
        streetNumber: exchangePointObject.streetNumber,
        floor: exchangePointObject.floor,
        apartment: exchangePointObject.apartment,
        zipCode: exchangePointObject.zipCode,
        country: exchangePointObject.country,
        city: exchangePointObject.city, //Saldria del api
        state: exchangePointObject.state, //Saldria del api
        coordinates :{
            latitude: exchangePointObject.latitude,
            longitude: exchangePointObject.longitude
        }
       };

       //lo freezo
       Object.freeze(this.exchangePointId)
       Object.freeze(this.type)
       Object.freeze(this.pointName)
       Object.freeze(this.receiver)
       Object.freeze(this.address)
       Object.freeze(this)
    }
}


export class ExchangePointEditObject{
    //recibe una instancia de ExchangePointDTO,la copia pero solo deja editable las propiedades que son editables
    //Luego con este objeto editado se manda a a repository.
    //para que esta capa leyendo este objeto le ordene a la capa persistencia haga la modificacion
    constructor(exchangePointDTOinstance){
        //Compruebo que sea una instancia
        if (!(exchangePointDTOinstance instanceof ExchangePointDTO)) throw new ExchangePointDTOERROR(ExchangePointDTOERROR.EDIT_DTO_ERROR,'|ExchangePointEditObject.constructor|')
        //Habria tmb que validar que para campo todo es correcto
        //copio las propiedades una a una como nuevas xq las propieddes del original estan freezadas
        this.exchangePointId = exchangePointDTOinstance.exchangePointId
        this.type = exchangePointDTOinstance.type;
        this.pointName = exchangePointDTOinstance.pointName;
        this.receiver = {...exchangePointDTOinstance.receiver};
        this.address = {
            ...exchangePointDTOinstance.address, // Copia superficial
            coordinates: {
                ...exchangePointDTOinstance.address.coordinates // Copia superficial
            }
        };

        //Congelo todas las propiedades inmodificables.
        //Object.freeze(this.exchangePointId)
        //Object.freeze(this)
        Object.defineProperty(this, 'exchangePointId', {
            value: this.exchangePointId,
            writable: false // No se puede cambiar
          })
        Object.freeze(this);

    }
}

export class ExchangePointConstructionObject {
    constructor(
        type,
        pointName,
        receiverName,
        receiverLastName,
        street,
        streetNumber,
        floor,
        apartment,
        zipCode,
        city,
        state,
        country,
        latitude,
        longitude,
        phones, //array
        locationType
    ) {
        //Faltarian hacer validaciones
        this.type= type;
        this.pointName = pointName;
        this.receiverName = receiverName;
        this.receiverLastName = receiverLastName;
        this.street = street;
        this.streetNumber = streetNumber;
        this.floor = floor;
        this.apartment = apartment;
        this.zipCode = zipCode;
        this.city = city;
        this.state = state;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.phones = phones;
        this.locationType = locationType; // Se validará el tipo de lugar
    }
}
