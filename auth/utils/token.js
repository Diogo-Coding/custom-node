const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, config.accessTokenSecret, { expiresIn: config.accessTokenExpiration });
  },

  generateRefreshToken: (payload) => {
    return jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiration });
  },

  verifyAccessToken: (token) => {
    return jwt.verify(token, config.accessTokenSecret);
  },

  verifyRefreshToken: (token, options = {}) => {
    return jwt.verify(token, config.refreshTokenSecret, options); // Opciones como { ignoreExpiration: true }
  },

  getRefreshTokenInfo: async (token) => {
    return jwt.decode(token, { complete: true }).payload;
  },
};
