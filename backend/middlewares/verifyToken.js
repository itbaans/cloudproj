const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Adjust the path as needed

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn({
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
    }, 'Access denied. No token provided.');

    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Optional success log (enable only if needed for audit)
    logger.info({
      userId: decoded.userId,
      path: req.originalUrl,
      method: req.method,
    }, 'Token verified successfully');

    next();
  } catch (err) {
    logger.error({
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      error: err.message,
    }, 'Invalid or expired token.');

    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = verifyToken;
