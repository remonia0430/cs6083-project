const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) return res.status(403).json({ message: 'Admin only' });
    next();
  };
  
  module.exports = isAdmin;
  