// src/routes/index.js
const router = require("express").Router(); // router [1]
router.use("/auth", require("./auth.routes")); // /api/auth/* [5]
router.use("/tasks", require("./task.routes")); // /api/tasks/* [5]
module.exports = router; // export [1]
