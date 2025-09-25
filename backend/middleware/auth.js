// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function permit(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.rol)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { authRequired, permit };
