// ====================== <IMPORTS> ====================== \\
require("dotenv").config()
const path = require('path');

// Server
const express = require("express")

// Middlewares
const control = require("./middlewares/control.js");
const helmet = require("helmet");
const cors = require("cors")
const morgan = require("morgan")

const logger = require('./utils/logger.js');
const requestLogger = require('./middlewares/logs/requestLogger.js');
const errorLogger = require('./middlewares/logs/errorLogger.js');

// Auth
const { authRoutes, authenticate, authorize } = require('./auth/index.js');

// API
const apiRoutes = require('./routes/apiRouter.js');

// Expecific imports
const { fgGreen, fgGray } = require('./utils/colors.js');
const fs = require('fs');

// ====================== <EXCEPTIONS> ====================== \\

// Capturar excepciones no controladas
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  console.error('Uncaught Exception:', err);
  process.exit(1); // Salida segura del proceso
});

// Capturar promesas rechazadas no manejadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`, { stack: reason.stack });
  console.error('Unhandled Rejection:', reason);
  process.exit(1); // Salida segura del proceso
});

// ====================== <CONFIGURATIONS> ====================== \\

const PORT = process.env.SERVER_PORT || 9009
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev")) // 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const whitelist = ['https://localhost:9009']; // Lista de URLs permitidas
const corsOptions = { // No se esta usando, pero se puede usar para permitir acceso solo a determinadas URLs
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('ACCESS DENIED'));
    }
  }
};

app.use(express.static('public')) // Servir archivos estáticos
app.use(cors()) // Configurar CORS

app.use(control) // Middleware extra, modificable segun necesite
app.use(requestLogger); // Middleware para registrar consultas HTTP

// ----- Controllers -----
app.use('/auth', authRoutes); // Montar las rutas de autenticación
app.use('/api', apiRoutes); // Montar las rutas de la API
// -----------------------

app.use(errorLogger); // Middleware para manejar errores

// ====================== <MOUNT SERVER> ====================== \\


// Https Server
const https = require('https');
const options = {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost.pem'),
  // key: fs.readFileSync('./certs/_.springhoteles.com.key'),
  // cert: fs.readFileSync('./certs/star_springhoteles_com.crt'),
};
const server = https
  .createServer(options, app)
  .listen(PORT, function () {
    // Add color to this console message
    const separation = '\n-------------------------------------------------\n';
    console.log(fgGray, separation);
    console.log(fgGreen,`Server running on port --> https://localhost:${PORT}`);
    console.log(fgGray, separation);
    logger.debug('Server running on port --> https://localhost:' + PORT);
  });

// ====================== <OTHER CALLS / SOCKET CALLS> ====================== \\

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = { app, server };