


// const { sequelize } = require('../config/db');
// const { DataTypes } = require("sequelize");


// const Users = sequelize.define("User", {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     name: { type: DataTypes.STRING, allowNull: false },
//     email: { type: DataTypes.STRING, allowNull: false, unique: true },
//     password: { type: DataTypes.STRING, allowNull: false },
//     role: {
//       type: DataTypes.ENUM("Admin", "Manager", "User"),
//       defaultValue: "User",
//     },
//   });


//   module.exports = Users;





// src/models/User.js
// const { DataTypes } = require('sequelize');
// module.exports = (sequelize) => sequelize.define('User', {
//   id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//   name: { type: DataTypes.STRING, allowNull: false },
//   email: { type: DataTypes.STRING, allowNull: false, unique: true },
//   passwordHash: { type: DataTypes.STRING, allowNull: false },
//   role: { type: DataTypes.ENUM('Admin','Manager','User'), defaultValue: 'User' }
// });

// src/models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  // Yahi par mapping add karo:
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  role: { type: DataTypes.ENUM('Admin','Manager','User'), defaultValue: 'User' }
});

