const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10, // Límite de 10 solicitudes por IP
  message: "Has excedido el límite de intentos de autenticación. Intenta de nuevo más tarde."
});

const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutos
  max: 25, // Límite de 25 solicitudes por IP
  message: {
    status: 429,
    error: "Demasiadas solicitudes, intenta de nuevo más tarde."
  }
});

module.exports = {
  authLimiter,
  apiLimiter
};