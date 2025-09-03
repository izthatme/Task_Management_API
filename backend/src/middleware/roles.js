// src/middleware/roles.js
module.exports = function allowRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(401).json({ message: 'Unauthorized' }); // token to hona hi chahiye [11]
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' }); // role allowed nahi [8]
    next(); // allowed -> aage jao [10]
  };
};
