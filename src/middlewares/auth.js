const jwt = require('jsonwebtoken');
authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Leer el token del header
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }
  try {
    //const decoded = jwt.verify(token, process.env.JWT_KEY); // Verifica el token con la clave secreta
    //req.user = decoded; // Agrega la información del usuario al objeto req
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token no válido.' + token });
  }
};
module.exports = authMiddleware;