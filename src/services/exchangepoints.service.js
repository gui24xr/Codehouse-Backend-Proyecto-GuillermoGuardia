import { ExchangePointsRepository } from "../repositories/exchangepoints-repository.js";
import { ExchangePointConstructionObject, ExchangePointDTO, ExchangePointEditObject } from "../dto/exchangepoint.dto.js";
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

    //Para estos 2 metodos podria usar traer todos los registros y luego filtrar pero seria ineficiente , traeria todos los registros
    //Por lo cual es preferible usar metodos de repository que me lo traen filtrados por tipos
    //Distinto es buscar entre los psoibles, el que necesito, ya depende de reglkas del negocio
    async getPickupPoints(){
        try{
            const pointsArray = await exchangePointsRepository.getPickupPoints()
            return pointsArray
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsService.getExchangePointById|')
        }
    }

    async getDeliveryPoints(){
        try{
            const pointsArray = await exchangePointsRepository.getDeliveryPoints()
            return pointsArray
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsService.getExchangePointById|')
        }
    }

    //Prepara el objeto, se lo mando a repository para que modifique el registro
    //Una vex modificado si todo salio ok, recibe el dto nuevo para devolver
    async updateExchangePoint(exchangePointId){
        try{
            const point = await this.getExchangePointById(exchangePointId)
            //con el dto crea una copia pero editable las cuales solo permiten se modifique de manera correcta el objeto.
            const editPoint = new ExchangePointEditObject(point)
            //Edito lo que quiero en el editPoint
            editPoint.address.street = 'Juancete'
            editPoint.address.streetNumber = 23
            editPoint.receiver = 33
            //Le pido a repository que haga la modificacion
            const updatedPoint = await exchangePointsRepository.updateExchangePoint(editPoint)
            return updatedPoint

            
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsService.updateExchangePoint|')
        }
    }
}