const router = require('express').Router();
const verifyAccess = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const { User } = require('../models');

router.use(verifyAccess);

router.get('/me', async (req, res, next) => {
  try {
    const me = await User.findByPk(req.user.id, { attributes: ['id','name','email','role'] });
    if (!me) return res.status(404).json({ message: 'Not found' });
    return res.json(me);
  } catch (e) { next(e); }
});

router.get('/', allowRoles('Admin'), async (req, res, next) => {
  try {
    const rows = await User.findAll({ attributes: ['id','name','email','role'], order: [['id','ASC']] });
    return res.json({ items: rows });
  } catch (e) { next(e); }
});

module.exports = router;


