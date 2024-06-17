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
        receiverName : exchangePointObject.receiverName,
        receiverLastName : exchangePointObject.receiverLastName
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


    }
}


const objectForMakeExchangePointDTO = {
    type: 'valor',
    pointName: 'valor',
    receiverName: 'valor',
    receiverLastName : 'valor',
    street: 'valor',
    streetNumber: 'valor',
    floor: 'valor',
    apartment: 'valor',
    zip_code: 'valor',
    country: 'country',
    latitude: 'valor',
    longitude: 'valor',
    phones: 'telefonos',
    locationType: 'Tipo de lugar // se validara'



    
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
