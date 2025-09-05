// const User = require("./User")(sequelize);
// const Task = require("./Task")(sequelize);
// const RefreshToken = require("./RefreshToken")(sequelize);

// User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });
// Task.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
// User.hasMany(Task, { foreignKey: "assignedTo", as: "assignedTasks" });
// Task.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });

// RefreshToken.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(RefreshToken, { foreignKey: "userId" });

// module.exports = { sequelize, User, Task, RefreshToken };


// src/models/index.js
// 1) DB config se sequelize lao
// const { sequelize } = require('../config/db');

// // 2) Model factories call karo (har model file export karta hai function (sequelize) => Model)
// const User = require('./User')(sequelize);
// const Task = require('./Task')(sequelize);
// const RefreshToken = require('./RefreshToken')(sequelize);

// // 3) Associations define karo (agar chahiye)
// User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
// Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
// Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// RefreshToken.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(RefreshToken, { foreignKey: 'userId' });

// // 4) Export everything
// module.exports = { sequelize, User, Task, RefreshToken };


// src/models/index.js
const { sequelize } = require('../config/db');
const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);
const RefreshToken = require('./RefreshToken')(sequelize);

// associations
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });

RefreshToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(RefreshToken, { foreignKey: 'userId' });

module.exports = { sequelize, User, Task, RefreshToken };
