const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const authRoutes = require('./routes/auth-routes');
const { generateAccessToken, generateRefreshToken } = require('./utils/token');

module.exports = {
  authenticate,
  authorize,
  authRoutes,
  generateAccessToken,
  generateRefreshToken,
};
