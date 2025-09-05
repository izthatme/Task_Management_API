// src/middleware/auth.js
const jwt = require("jsonwebtoken"); // JWT [7]

module.exports = function verifyAccess(req, res, next) {
  const authHeader = req.headers.authorization || ""; // header [7]
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const cookieToken = req.cookies?.accessToken || null;
  const token = bearerToken || cookieToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" }); // 401 [7]
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // verify [7]
    const userId = payload.id || payload.sub; // support both styles
    req.user = { id: userId, role: payload.role }; // attach claims [7]
    return next(); // ok [7]
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" }); // invalid [7]
  }
};
