const list = [
  '/auth/*', // All URLs under /auth
  '/test/1' // Specific URL
]

// Función para verificar si la URL es privada
const isPrivateURL = (url) => {
  return list.some((pattern) => {
    if (pattern.endsWith('*')) {
      // Coincidencia de prefijo
      return url.startsWith(pattern.slice(0, -1));
    }
    // Coincidencia exacta
    return url === pattern;
  });
};

module.exports = {
  isPrivateURL,
  list
};