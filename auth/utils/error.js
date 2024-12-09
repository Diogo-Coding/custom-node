// Clase base para errores personalizados
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error de autenticación
class AuthError extends CustomError {
  constructor(message = 'Authentication failed', statusCode = 401) {
    super(message, statusCode);
    this.name = 'AuthError';
  }
}

// Error de autorización
class AuthorizationError extends CustomError {
  constructor(message = 'Access denied', statusCode = 403) {
    super(message, statusCode);
    this.name = 'AuthorizationError';
  }
}

// Error de validación
class ValidationError extends CustomError {
  constructor(message = 'Validation error', statusCode = 400) {
    super(message, statusCode);
    this.name = 'ValidationError';
  }
}

// Error interno del servidor
class InternalServerError extends CustomError {
  constructor(message = 'Internal server error', statusCode = 500) {
    super(message, statusCode);
    this.name = 'InternalServerError';
  }
}

module.exports = {
  CustomError,
  AuthError,
  AuthorizationError,
  ValidationError,
  InternalServerError,
};
