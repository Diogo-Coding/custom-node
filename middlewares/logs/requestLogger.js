const logger = require('../../utils/logger');
const { isPrivateURL } = require('../../utils/privateDataURL');

// Middleware para registrar las consultas HTTP
const requestLogger = (req, res, next) => {
  const user = req.user || 'Sin usuario'; // Extraer el usuario autenticado (si aplica)
  let logMessage = `${req.method} ${req.originalUrl} | From: ${req.ip} | User: ${user}`;
  // Check if the request is private
  if (!isPrivateURL(req.originalUrl) && req.body) {
    logMessage += `\n Request Body: ${JSON.stringify(req.body, null, 2)}`;
  }

  logger.info(logMessage); // Registrar la consulta
  next();
};

module.exports = requestLogger;
