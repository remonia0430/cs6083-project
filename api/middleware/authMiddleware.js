const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Login required' });

    try {
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET); // 添加 req.user
        next();
    } 
    catch (err) {
        console.error("JWT verify error:", err.message);
        return res.status(403).json({ message: 'Invalid token' });
    }
  };

module.exports = verifyToken;


