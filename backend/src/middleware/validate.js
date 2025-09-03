const { validationResult } = require('express-validator');
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return res.status(400).json({ message: 'Validation failed', errors: result.array() });
};
