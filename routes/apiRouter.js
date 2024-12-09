const express = require('express');
const authenticate = require('../auth/middleware/authenticate.js');
const authorize = require('../auth/middleware/authorize.js');
const verifyApiKey = require('../middlewares/verifyApiKey.js');

const { exampleCall } = require('../controllers/exampleController.js');

const router = express.Router();

// Rutas de autenticación
router.post('/exampleCall', verifyApiKey, exampleCall);

module.exports = router;