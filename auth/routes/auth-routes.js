const express = require('express');
const authenticate = require('../middleware/authenticate.js');
const authorize = require('../middleware/authorize.js');
const { login, refresh, logoutFromSession, logoutFromAllSessions, createUser } = require('../controllers/auth-controller');
const verifyApiKey = require('../../middlewares/verifyApiKey.js');

const router = express.Router();

// Rutas de autenticación
router.post('/login', verifyApiKey, login);
router.post('/refresh', verifyApiKey, refresh);
router.post('/logout', authenticate, logoutFromSession);
router.post('/logoutAll', authenticate, logoutFromAllSessions);

//* Add 'authorize' middleware with scope write:users if create user is only accessible to users with permission
//* or add 'authenticate' middleware if create user is accessible to everyone but only with a valid token
//* If your page doesnt have a register page, you must use the authenticate middleware to make sure no one can register without being logged in first and valid session
//* Examples:
router.post('/register', verifyApiKey, authenticate, authorize(['write:users']), createUser);
// router.post('/register', authenticate, createUser);
// router.post('/register', createUser);

module.exports = router;
