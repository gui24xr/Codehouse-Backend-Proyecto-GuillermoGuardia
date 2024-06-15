export class DeliveryPointDTO{
    constructor(deliveryPointObject){
        //Las validaciones se hacen mas tarde
        /*
        Necesitamos tener un objeto que tenga las propiedades:
        
        */
       this.receiver = {
        receiverName : deliveryPointObject.receiverName,
        receiverLastName : deliveryPointObject.receiverLastName
       };
       
       this.adress = {
        locationType : deliveryPointObject.locationType,
        street: deliveryPointObject.street,
        streetNumber: deliveryPointObject.streetNumber,
        floor: deliveryPointObject.floor,
        apartment: deliveryPointObject.apartment,
        zip_code: deliveryPointObject.zip_code,
        country: deliveryPointObject.country,
        city: deliveryPointObject.country, //Saldria del api
        state: deliveryPointObject.country, //Saldria del api
        coordinates :{
            latitude: deliveryPointObject.latitude,
            longitude: deliveryPointObject.longitude
        }
       };

    }
}


const objectForMakeDeliveryPointDTO = {
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

export class DeliveryPointConstructionObject{

    
}