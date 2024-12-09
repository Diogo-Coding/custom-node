

// ========================================================================
// ========================================================================
// ========================================================================

// Controlador para logout
const exampleCall = async (req, res, next) => {
  return res.json({ 
    message: 'Mensaje recibido', 
    timestamp: new Date().toISOString(), 
    received: req.body.message 
  });
};

module.exports = { exampleCall };