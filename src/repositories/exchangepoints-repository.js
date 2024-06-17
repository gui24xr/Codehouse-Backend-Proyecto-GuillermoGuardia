
import { ExchangePointsDAO } from "../dao/factory.js";
import { ExchangePointDTO, ExchangePointConstructionObject } from "../dto/exchangepoint.dto.js";
import { ExchangePointsServiceError, ExchangePointDTOERROR } from "../services/errors.service.js";

const exchangePointsDAO = new ExchangePointsDAO()
export class ExchangePointsRepository{

    async createExchangePoint(exchangePointCreateData){
        //Le pide a la BD la creacion de un deliveryPoint, 
        //Recibe de service un objeto de creacion y comprueba que lo sea antes de enviarlo a la BD
        //toma el DTO devuelto y lo retorna.
        try{
            if (!(exchangePointCreateData instanceof ExchangePointConstructionObject)) throw new ExchangePointsServiceError(ExchangePointsServiceError.NO_EXCHANGE_POINT_DTO_VALID,'|ExchangePointsRepository.createExchangePoint|')
            const newExchangePoint = await exchangePointsDAO.create(exchangePointCreateData)
           return newExchangePoint 
    
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsRepository.createExchangePoint|')
        }
    }


    async getExchangePoint(exchangePointId){
        try{
            //Siempre devuelve un array, en este caso como es por x id solo devuelve array de una posicion o vacio si no hay nada.
            const points = await exchangePointsDAO.get({id:exchangePointId})
            if (points.length < 1) return null
            else return points[0]
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsRepository.getExchangePoint|')
        }
    }

    //Devuelve los puntos de retiro.
    //mas adelante usando coordenadas clasificaremos por cercania.
    async getPickupPoints(){
        try{
            //Siempre devuelve un array, en este caso como es por x id solo devuelve array de una posicion o vacio si no hay nada.
            const points = await exchangePointsDAO.get({"type": "pickup"})
            if (points.length < 1) return null
            else return points
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsRepository.getExchangePoint|')
        }
    }

    

    async editExchangePoint(exchangePointId,field,newValue){
        try{
           //Implementar mas adelante cuando se use
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsRepository.editExchangePoint|')
        }
    }

    
    async deleteExchangePoint(exchangePointId){
        try{
            //Siempre devuelve un array, en este caso como es por x id solo devuelve array de una posicion o vacio si no hay nada.
            const points = await exchangePointsDAO.delete({id:exchangePointId})
            if (points.length < 1) return null
            else return points[0]
        }catch(error){
            if (error instanceof ExchangePointsServiceError || error instanceof ExchangePointDTOERROR) throw error
            else throw new ExchangePointsServiceError(ExchangePointsServiceError.INTERNAL_SERVER_ERROR,'|ExchangePointsRepository.deleteExchangePoint|')
        }
    }

}