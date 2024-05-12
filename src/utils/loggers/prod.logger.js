import winston from 'winston'
import { consoleFormat,fileFormat,customLevelOptions } from './logger.configs.js'

const consoleTransport = new winston.transports.Console({
    level: 'info',
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


const prodLogger = winston.createLogger(loggerOptions)

export {prodLogger}




