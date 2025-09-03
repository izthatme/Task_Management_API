// src/middleware/auth.js
const jwt = require("jsonwebtoken"); // JWT [7]

module.exports = function verifyAccess(req, res, next) {
  const h = req.headers.authorization || ""; // header [7]
  if (!h.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" }); // 401 [7]
  const token = h.split(" "); // token [7]
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // verify [7]
    req.user = { id: payload.id, role: payload.role }; // attach claims [7]
    return next(); // ok [7]
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" }); // invalid [7]
  }
};
