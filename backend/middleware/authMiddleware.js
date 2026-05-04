const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // El token suele venir en el header Authorization: Bearer <token>
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token provisto.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Formato de token inválido.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro_123');
    req.usuario = verified;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido o expirado.' });
  }
};
