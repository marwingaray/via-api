const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();
const publicKey = process.env.PUBLIC_KEY_JWT.replace(/\\n/g, '\n');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token missing or malformed',
      code: 'AUTH_HEADER_INVALID',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    req.user = decoded; // Optional
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(403).json({
      success: false,
      message: isExpired ? 'Token has expired' : 'Invalid token',
      code: isExpired ? 'EXPIRED_TOKEN' : 'INVALID_TOKEN',
    });
  }
};

module.exports = verifyToken;