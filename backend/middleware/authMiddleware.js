const jwt = require('jsonwebtoken');
const db = require('../models');

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid user" });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
module.exports = verifyToken;
