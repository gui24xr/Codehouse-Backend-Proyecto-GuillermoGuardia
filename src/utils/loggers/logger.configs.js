import winston from 'winston'

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "blue",
    info: "green",
    http: "magenta",
    debug: "cyan",
  },
};



const consoleFormat = winston.format.combine(
  winston.format.colorize({
      all:true,
      colors: customLevelOptions.colors
  }),
  winston.format.label({
      label:'***LOGGER***'
  }),
  winston.format.timestamp({
      format:"YY-MM-DD HH:MM:SS"
  }),
  winston.format.printf(
      info => `${info.label} [${info.level} at ${info.timestamp}] Log: ${info.message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.label({
      label:'***[LOGGER]***'
  }),
  winston.format.timestamp({
      format:"YY-MM-DD HH:MM:SS"
  }),
  winston.format.printf(
      info => `${info.label} [${info.level} at ${info.timestamp}] Log: ${info.message}`
  )
);

export {consoleFormat, fileFormat, customLevelOptions}