const logger = require('../../utils/logger');

// Middleware para registrar errores
const errorLogger = (err, req, res, next) => {
  // Date in format YYYY-MM-DD HH:mm:ss
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const logMessage = `Error en ruta: ${req.method} ${req.originalUrl} | IP: ${req.ip} | Mensaje: ${err.message} | Log timestamp: ${timestamp}`;

  // Registrar el error
  logger.error(logMessage);

  // Pasar el error al siguiente middleware o devolverlo al cliente
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: 'Internal Server Error | Couldn\'t process your request. Please try again later or contact us.',
    timestamp: `${timestamp} | ${new Date(timestamp).getTime()}`,
    url: req.originalUrl,
  });
};

module.exports = errorLogger;
