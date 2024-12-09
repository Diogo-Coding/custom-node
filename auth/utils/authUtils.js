const bcrypt = require('bcrypt');

// Número de rondas para la generación de sal (cost factor)
const { SALT_ROUNDS } = require('../../config/config.js');

/**
 * Encripta una contraseña usando bcrypt.
 * @param {string} password - Contraseña sin encriptar.
 * @returns {Promise<string>} - Contraseña encriptada.
 * @throws {Error} - Si ocurre un error durante la encriptación.
 */
const hashPassword = async (password) => {
  try {
    // Verificar que la contraseña no sea nula o vacía
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw new Error('La contraseña no puede estar vacía.');
    }

    // Generar el hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error.message);
    throw new Error('No se pudo encriptar la contraseña.');
  }
};

/**
 * Compara una contraseña sin encriptar con una contraseña encriptada.
 * @param {string} plainPassword - Contraseña sin encriptar proporcionada por el usuario.
 * @param {string} hashedPassword - Contraseña encriptada almacenada en la base de datos.
 * @returns {Promise<boolean>} - `true` si las contraseñas coinciden, de lo contrario `false`.
 * @throws {Error} - Si ocurre un error durante la comparación.
 */
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    // Verificar que ambos parámetros sean válidos
    if (!plainPassword || typeof plainPassword !== 'string' || plainPassword.trim() === '') {
      throw new Error('La contraseña proporcionada no es válida.');
    }
    if (!hashedPassword || typeof hashedPassword !== 'string') {
      throw new Error('La contraseña encriptada no es válida.');
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error al comparar las contraseñas:', error.message);
    throw new Error('No se pudo comparar las contraseñas.');
  }
};

/**
 * Valida las credenciales de un usuario (ejemplo para autenticación).
 * @param {string} username - Nombre de usuario proporcionado.
 * @param {string} plainPassword - Contraseña sin encriptar proporcionada.
 * @param {Object} userRecord - Registro del usuario obtenido de la base de datos (contiene `username` y `hashedPassword`).
 * @returns {Promise<boolean>} - `true` si las credenciales son válidas, de lo contrario `false`.
 * @throws {Error} - Si ocurre un error durante la validación.
 */
const validateCredentials = async (username, plainPassword, userRecord) => {
  try {
    // Validar que se hayan proporcionado todos los parámetros necesarios
    if (!username || typeof username !== 'string' || username.trim() === '') {
      throw new Error('El nombre de usuario no puede estar vacío.');
    }
    if (!plainPassword || typeof plainPassword !== 'string' || plainPassword.trim() === '') {
      throw new Error('La contraseña no puede estar vacía.');
    }
    if (!userRecord || typeof userRecord !== 'object') {
      throw new Error('El registro del usuario no es válido.');
    }

    // Comparar nombres de usuario (puedes adaptar esta lógica según sea necesario)
    if (username != userRecord.username) {
      return false;
    }

    // Comparar contraseñas
    const isPasswordValid = await comparePasswords(plainPassword, userRecord.password);
    if (!isPasswordValid) {
      return false;
    }

    // Si todo es válido
    return true;
  } catch (error) {
    throw new Error('No se pudieron validar las credenciales.');
  }
};

module.exports = {
  hashPassword,
  comparePasswords,
  validateCredentials,
};
