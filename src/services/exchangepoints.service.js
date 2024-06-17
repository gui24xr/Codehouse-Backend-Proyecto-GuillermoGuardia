import { ExchangePointsRepository } from "../repositories/exchangepoints-repository.js";
import { ExchangePointConstructionObject, ExchangePointDTO } from "../dto/exchangepoint.dto.js";
import { ExchangePointsServiceError, ExchangePointDTOERROR } from "./errors.service.js";


const exchangePointsRepository = new ExchangePointsRepository()

export class ExchangePointsService{

    async createExchangePoint(type,pointName,receiverName,receiverLastName,street,streetNumber,floor,
        apartment,zipCode,city,state,country,latitude,longitude,phones,locationType){
        try{
            const newExchangePointData = new ExchangePointConstructionObject(type,pointName,
                receiverName,receiverLastName,street,streetNumber,floor,apartment,
                zipCode,city,state,country,latitude,longitude,phones,locationType  
            )
            const newExchangePoint = await exchangePointsRepository.createExchangePoint(newExchangePointData)
            //Retorna DTO ya que es lo que viene desde la capa mas baja.
            return newExchangePoint
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsService.createExchangePoint|')
        }
    }

    async getExchangePointById(exchangePointId){
        try{
            const point = await exchangePointsRepository.getExchangePoint(exchangePointId)
            return point
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsService.getExchangePointById|')
        }
    }

    async getPickupPoints(){
        try{
            const pointsArray = await exchangePointsRepository.getPickupPoints()
            return pointsArray
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsService.getExchangePointById|')
        }
    }
}