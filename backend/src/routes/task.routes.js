// // src/routes/task.routes.js
// const router = require("express").Router(); // tasks sub-router [1]
// router.get("/", (req, res) => res.json({ ok: true, path: "/api/tasks" })); // list stub [6]
// router.post("/", (req, res) =>
//   res.status(201).json({ ok: true, path: "/api/tasks", body: req.body })
// ); // create stub [6]
// module.exports = router; // export [1]


// src/routes/task.routes.js
// const router = require('express').Router(); // router [1]
// const verifyAccess = require('../middleware/auth'); // JWT [7]
// const allowRoles = require('../middleware/roles'); // RBAC [9]
// const ctrl = require('../controllers/task.controller'); // controller [5]

// router.use(verifyAccess); // all tasks require auth [7]

// router.get('/', ctrl.list); // list 
// router.get('/:id', ctrl.getOne); // get one [4]
// router.post('/', ctrl.create); // create [1]
// router.patch('/:id', ctrl.update); // update [1]
// router.delete('/:id', allowRoles('Admin'), ctrl.remove); // delete (Admin) [9]

// module.exports = router; // export [1]
// src/routes/task.routes.js



const router = require('express').Router();
const verifyAccess = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const ctrl = require('../controllers/task.controller');

router.use(verifyAccess);                 // sab /tasks par token required [11]
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', allowRoles('Admin'), ctrl.remove); // sirf Admin delete kar sake [11]

module.exports = router;

