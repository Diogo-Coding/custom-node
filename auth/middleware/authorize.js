module.exports = (requiredScopes) => {
  return (req, res, next) => {
    const userScopes = req.user.scopes || [];
    const hasPermission = requiredScopes.every(scope => userScopes.includes(scope));

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
