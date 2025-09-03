const { DataTypes } = require("sequelize");
module.exports = (sequelize) =>
  sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("todo", "in_progress", "done"),
      defaultValue: "todo",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
    dueDate: { type: DataTypes.DATE },
    createdBy: { type: DataTypes.INTEGER },
    assignedTo: { type: DataTypes.INTEGER },
  });
