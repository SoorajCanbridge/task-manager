const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { findUserById } = require('../controllers/authController');

async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
module.exports = authenticate;
