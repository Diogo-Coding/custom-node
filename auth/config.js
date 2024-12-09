module.exports = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret',
  accessTokenExpiration: '15m', // Expiration time for access tokens
  refreshTokenExpiration: '7d', // Expiration time for refresh tokens
};
