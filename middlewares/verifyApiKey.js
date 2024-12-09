function verifyApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.VALID_API_KEY) {
    return res.status(403).json({ error: 'Invalid or empty API Key field' });
  }
  next();
}

module.exports = verifyApiKey;