//Este es el dao de mongo para carts.
import { ExchangePointModel } from "../../models/exchangepoint.model.js"
import { ExchangePointDTO, ExchangePointConstructionObject } from "../../dto/exchangepoint.dto.js"
import { ExchangePointsServiceError, ExchangePointDTOERROR } from "../../services/errors.service.js";

export default class ExchangePointsMongoDAO{


    //funcion interna para construir los DTO
    //Esta es interna de cada dao x lo cual no debe ser homologado
    //Lo que es homologado es el 
    getExchangePointDTO(exchangePointFromDB){
        return new ExchangePointDTO({
           id: exchangePointFromDB._id,
           type: exchangePointFromDB.type,
           pointName: exchangePointFromDB.pointName,
           receiverName: exchangePointFromDB.receiver.name,
           receiverLastName: exchangePointFromDB.receiver.last_name,
           phones: exchangePointFromDB.phones,
           locationType: exchangePointFromDB.location_type,
           street: exchangePointFromDB.address.streetNumber,
           streetNumber: exchangePointFromDB.address.streetNumber,
           floor: exchangePointFromDB.address.floor,
           apartment: exchangePointFromDB.address.floor,
           zipCode: exchangePointFromDB.address.zip_code,
           country: exchangePointFromDB.address.country,
           city: exchangePointFromDB.address.city,
           state: exchangePointFromDB.address.state,
           latitude: exchangePointFromDB.coordinates.latitude,
           longitude: exchangePointFromDB.coordinates.longitude
        })
    }

     // Función interna para transformar el filtro
     transformFilter(filter) {
        const transformedFilter = { ...filter };
        if (filter.id) {
            transformedFilter._id = filter.id;
            delete transformedFilter.id;
        }
        return transformedFilter;
    }
    
    //Recibe un objeto
    async create(pointData) {
        //Point data es un objeto de construccion de points
        try {
            const newExchangePoint = new ExchangePointModel({
                type: pointData.type,
                pointName : pointData.pointName,
                receiver: {
                    name: pointData.receiverName,
                    last_name: pointData.receiverLastName
                },
                address: {
                    street: pointData.street,
                    streetNumber: pointData.streetNumber,
                    city: pointData.city,
                    state: pointData.state,
                    zip_code: pointData.zipCode,
                    country: pointData.country,
                    floor: pointData.floor,
                    apartment: pointData.apartment
                },
                coordinates: {
                    latitude: pointData.latitude,
                    longitude: pointData.longitude
                },
                phones: pointData.phones,
                location_type: pointData.locationType
            });
    
            await newExchangePoint.save();
            return this.getExchangePointDTO(newExchangePoint)
        } catch (error) {
            if (error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.CREATE_ERROR,'|ExchangePointsMongoDAO.create|',error.message)
           
        }
    }


    
    async get(filter){
        try{
            const transformedFilter = this.transformFilter(filter);
            const pointsArray = await ExchangePointModel.find(transformedFilter)
            //Tengo el array con coincidencias, y quiero devolver lista de DTO
            const pointsDTOArray = pointsArray.map( point => (
                this.getExchangePointDTO(point)
            ))
            return pointsDTOArray
        }catch(error){
            if (error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.GET_ERROR,'|ExchangePointsMongoDAO.get|',error.message)
        }
    }
    


    async update(filter,updateData){
        //Busca los registros que coincidan con el filtro, los actualiza con updateData y devuelve un array de DTO con la data actualizada.
        try{
            const transformedFilter = this.transformFilter(filter);
            //Validar filtro y updateData
            //updatemany actualiza, no devuelve lo actualizado asique luego debo hacer find para reobtener los registros.
            await ExchangePointModel.updateMany(transformedFilter,updateData)
            const updatedPoints = await ExchangePointModel.find(transformedFilter)
            const pointsDTOArray = updatedPoints.map( point => (
                this.getExchangePointDTO(point)
            ))
            return pointsDTOArray
        }catch(error){
            if (error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.UPDATING_ERROR,'|ExchangePointsMongoDAO.update|',error.message)
        }
    }


    async delete(filter){
        //Busca los registros que coinciden con el filtro y los elimina, devuelve una lista de dto con copia de los registros eliminados
        try{
            const transformedFilter = this.transformFilter(filter);
            //falta validar los filtros.
            //Los busco y guardo un array
            const pointsToDelete =  await ExchangePointModel.find(transformedFilter) 
            const pointsDTOArray = pointsToDelete.map( point => (
                this.getExchangePointDTO(point)
            ))
            //Los borro
            await ExchangePointModel.deleteMany(filter)
            //Devuelvo la lista con las copias de lo borrado si salio todo bien.
            return pointsDTOArray
        }catch(error){
            if (error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.DELETING_ERROR,'|ExchangePointsMongoDAO.update|',error.message)
        }
    }

}