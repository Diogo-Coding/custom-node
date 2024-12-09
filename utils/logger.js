const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

// Crear formato personalizado para logs
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Función para crear un logger personalizado con un filtro de nivel
const createLogger = (level, filename) => {
  return new DailyRotateFile({
    filename: path.join(__dirname, `../logs/${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Comprimir archivos antiguos
    maxSize: process.env.LOGS_MAX_SIZE, // Tamaño máximo antes de rotar
    maxFiles: process.env.LOGS_MAX_FILES, // Tiempo de retención de logs
    level, // Nivel mínimo de log que se almacena en este transporte
    format: winston.format.combine(
      winston.format((info) => {
        // Filtrar mensajes que no correspondan al nivel del transporte
        return info.level === level ? info : false;
      })(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
  });
};

// Crear el logger principal
const logger = winston.createLogger({
  level: 'debug', // Nivel mínimo de log global
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Logs de nivel "info"
    createLogger('info', 'info'),
    // Logs de nivel "error"
    createLogger('error', 'error'),
    // Logs de nivel "debug"
    createLogger('debug', 'debug'),
  ],
});

// Ejemplo de uso
logger.debug('Logger iniciado');

module.exports = logger;
