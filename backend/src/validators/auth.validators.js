const { body } = require('express-validator');
const registerRules = [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').optional().isIn(['Admin','Manager','User'])
];
const loginRules = [
  body('email').isEmail(),
  body('password').notEmpty()
];
module.exports = { registerRules, loginRules };
