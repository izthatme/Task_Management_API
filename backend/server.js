// // server.js
// require("dotenv").config(); // env [3]
// const express = require("express"); // express [3]
// const cookieParser = require("cookie-parser")
// const cors = require("cors")
// const app = express();

// // core middleware
// app.use(express.json()); // JSON body parser [3]
// app.use(cookieParser());

// app.use(cors({
//     credentials: true,
//     origin: "http://localhost:5173"
// }));
// // mount API routes
// const apiRoutes = require("./src/routes"); // src/routes/index.js [1]
// app.use("/api", apiRoutes); // /api/* [1]

// // health check
// app.get("/health", (req, res) => res.json({ ok: true })); // sanity [1]

// // DB + models
// const { initDb } = require("./src/config/db"); // authenticate [4]
// const { sequelize, User } = require("./src/models"); // aggregated models [4]

// // sample DB route (optional)
// app.get("/", async (req, res, next) => {
//   try {
//     const data = await User.findOne({ where: { email: "amit1234@gmail.com" } }); // demo [4]
//     if (!data) return res.status(404).json({ message: "User not found" }); // 404 [1]
//     return res.json(data.toJSON()); // instance -> JSON [4]
//   } catch (e) {
//     next(e);
//   }
// });

// // error handler (keep last)
// app.use((err, req, res, next) => {
//   console.error(err); // log [1]
//   res
//     .status(err.status || 500)
//     .json({ message: err.message || "Internal error" }); // uniform error [1]
// });

// // bootstrap
// const port = process.env.PORT || 4000; // port [3]
// (async () => {
//   try {
//     await initDb(); // sequelize.authenticate() [4]
//     await sequelize.sync({ alter: true }); // DEV ONLY schema align [4]
//     app.listen(port, () => console.log(`Server Started Port :${port}`)); // start [1]
//   } catch (e) {
//     console.error("Startup failed:", e.message); // fail log [1]
//     process.exit(1); // exit [1]
//   }
// })();

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());


// routes
const apiRoutes = require("./src/routes");
app.use("/api", apiRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// DB + models
const { initDb } = require("./src/config/db");
const { sequelize, User } = require("./src/models");

// sample DB test route
app.get("/", async (req, res, next) => {
  try {
    const data = await User.findOne({ where: { email: "amit1234@gmail.com" } });
    if (!data) return res.status(404).json({ message: "User not found" });
    return res.json(data.toJSON());
  } catch (e) {
    next(e);
  }
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal error" });
});

// ✅ Bootstrap (Render friendly)
const port = process.env.PORT || 4000;
(async () => {
  try {
    await initDb();
    await sequelize.sync(); // ✅ avoid `alter: true` in production (slows startup)
    app.listen(port, () => console.log(`🚀 Server Started on Port ${port}`));
  } catch (e) {
    console.error("❌ Startup failed:", e.message);
    // ⚠️ Don't exit immediately, let Render restart
  }
})();
