const { verifyRefreshToken, generateAccessToken, generateRefreshToken, getRefreshTokenInfo } = require('../utils/token');
const { auth_pool: pool } = require('../../config/auth_db.js');
const { validateCredentials, hashPassword } = require('../utils/authUtils.js');
const { AuthError, ValidationError } = require('../utils/error.js');

// ========================================================================
// ========================================================================
// ========================================================================

// Controlador para login
const login = async (req, res, next) => {
  const { username, password, device_id } = req.body;

  try {
    if (!username || !password || !device_id) {
      throw new AuthError('Todos los campos son obligatorios', 400);
    }

    // Simula buscar al usuario en la base de datos
    let [user] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);

    if (user.length == 0) {
      throw new AuthError('Invalid username or password', 401);
    } else {
      user = user[0]
    }

    // Validar las credenciales
    const isValid = await validateCredentials(username, password, user);

    if (!isValid) {
      throw new AuthError('Invalid username or password', 401);
    }

    let [scopes] = await pool.query(`
    SELECT 
      u.id AS user_id,
      u.username AS user_username,
      s.name AS scope_name,
      s.description AS scope_description
    FROM 
      users u
    JOIN 
      roles r ON u.role_id = r.id
    JOIN 
      role_scopes rs ON r.id = rs.role_id
    JOIN 
      scopes s ON rs.scope_id = s.id
    WHERE 
      u.id = ?`, [user.id]);
    
    scopes = scopes.map(scope => scope.scope_name);

    // Generar tokens (si las credenciales son válidas)
    const accessToken = generateAccessToken({ id: user.id, username: user.username, scopes, role: user.role_id });
    const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

    // Create session with tokens and user data
    // Use token info for expires_at
    await createSession(user.id, device_id, refreshToken);

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    // Not user defined errors we use middleware
    next(error); // Propaga el error al middleware
  }
};


// Controlador para refrescar el token
const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token requerido' });
  }

  try {
    // Validar el refresh token
    const decoded = verifyRefreshToken(refreshToken, { ignoreExpiration: true });

    // Verificar si el refresh token existe en la base de datos
    const [sessions] = await pool.query(`
      SELECT * FROM sessions WHERE refresh_token = ?
    `, [refreshToken]);

    if (sessions.length == 0) {
      return res.status(401).json({ message: 'Refresh token inválido' });
    }

    let session = sessions[0]
    if (new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ message: 'Refresh token expirado' });
    }

    // Generar nuevos tokens
    const newAccessToken = generateAccessToken({ username: decoded.username, id: decoded.id });
    const newRefreshToken = generateRefreshToken({ username: decoded.username, id: decoded.id });

    // Create session with tokens and user data
    // Use token info for expires_at
    await createSession(session.user_id, session.device_id, newRefreshToken);

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error); // Propaga el error al middleware
  }
};


// Controlador para logout
const logoutFromSession = async (req, res, next) => {
  const { refreshToken, device_id } = req.body;
  
  if (!refreshToken && !device_id) {
    return res.status(400).json({ message: 'Refresh token o device_id requerido' });
  }

  try {
    let result;
    if (refreshToken) { // Logout using refresh token
      result = await pool.query(`
        DELETE FROM sessions WHERE refresh_token = ?
      `, [refreshToken]);
    } else if (device_id) { // Logout using device_id
      result = await pool.query(`
        DELETE FROM sessions WHERE device_id = ?
      `, [device_id]);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
  
    return res.json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    next(error); // Propaga el error al middleware
  }
};

// Disconnect all sessions for a user
const logoutFromAllSessions = async (req, res, next) => {
  const { userId } = req.body;

  try {
    // Eliminar todas las sesiones del usuario
    await pool.query(`
      DELETE FROM sessions WHERE user_id = ?
    `, [userId]);

    return res.json({ message: 'Todas las sesiones cerradas exitosamente' });
  } catch (error) {
    next(error); // Propaga el error al middleware
  }
};

// Get active sessions for a user
const getActiveSessions = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const sessions = await pool.query(`
      SELECT id, device_id, created_at, last_active_at, expires_at
      FROM sessions WHERE user_id = ?
    `, [userId]);
  
    return res.json(sessions);
  } catch (error) {
    next(error); // Propaga el error al middleware
  }
};

const createSession = async (userId, device_id, refreshToken) => {
  try {
    // expires_at and created_at date is from refresh_token payload data
    const info = await getRefreshTokenInfo(refreshToken);
    // ON DUPLICATE KEY UPDATE is used to update the session if it already exists
    const session = await pool.query(`
      INSERT INTO sessions (user_id, device_id, refresh_token, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        refresh_token = VALUES(refresh_token),
        expires_at = VALUES(expires_at)
    `, [userId, device_id, refreshToken, new Date(info.iat * 1000), new Date(info.exp * 1000)]);
  
    return session;
  } catch (error) {
    // Return an error
    throw error;
  }
};

// Controlador para crear un usuario
const createUser = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!role) {
    role = 2; // `2` asume que "user" es el rol predeterminado
  }

  try {
    if (!username || !email || !password) {
      throw new ValidationError('Todos los campos son obligatorios', 400);
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query(
      `SELECT id FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (existingUser.length > 0) {
      throw new ValidationError('El nombre de usuario o correo ya está en uso', 409);
    }

    // Encriptar la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear el usuario en la base de datos
    const [result] = await pool.query(
      `INSERT INTO users (id, username, email, password, role_id)
       VALUES (UUID(), ?, ?, ?, ?)`,
      [username, email, hashedPassword, role]
    );

    // Obtener el usuario recién creado
    const [newUser] = await pool.query(
      `SELECT id, username, email, role_id
       FROM users WHERE username = ?`,
      [username]
    );

    // Devolver la información del usuario creado (sin la contraseña)
    return res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    // console.error('Error inesperado:', error);
    next(error); // Propaga el error al middleware
  }
};

// TODO: UPDATE USER
// TODO: DELETE USER

module.exports = { login, refresh, logoutFromSession, logoutFromAllSessions, getActiveSessions, createUser };
