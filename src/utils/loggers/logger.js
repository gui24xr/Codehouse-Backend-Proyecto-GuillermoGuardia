
import { devLogger } from "./dev.logger.js"
import { prodLogger } from "./prod.logger.js"

//Segun el entorno elijo u logger dev o logger production
//Separe bien ambos por si a futuro quiero tocar de cada uno configuraciones y formatos, solo comparten colores y nivel de del log.

export const logger = process.env.NODE_ENV === 'development' ? devLogger : prodLogger;
