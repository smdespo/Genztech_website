const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ detail: 'Admin token missing.' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ detail: 'Not an admin token.' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid or expired admin token.' });
  }
}

module.exports = { requireAdmin };
