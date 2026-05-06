const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token provisto.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Formato de token inválido.' });
  }

  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
    const verified = jwt.verify(token, jwtSecret);
    req.usuario = verified;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido o expirado.' });
  }
};
