const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,        // DB name
  process.env.DB_USER,        // DB user
  process.env.DB_PASS,        // DB password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,  // ✅ Railway custom port (important!)
    dialect: "mysql",
    logging: false,             // disable SQL logs in console
  }
);

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

module.exports = { sequelize, initDb };
