import winston from 'winston'
import { consoleFormat,fileFormat,customLevelOptions } from './logger.configs.js'
  



const consoleTransport = new winston.transports.Console({
    level: 'debug',
    format: consoleFormat
})



const fileTransport = new winston.transports.File({
    filename : './errors.log',
    level: 'error',
    format: fileFormat

})


const loggerOptions = {
    levels : customLevelOptions.levels,
    transports:[
         consoleTransport,
         fileTransport
    ]
}


const devLogger = winston.createLogger(loggerOptions)

export {devLogger}




