const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const RefreshToken = sequelize.define("RefreshToken", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    expiryDate: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE },
  });
  RefreshToken.verifyExpiration = (row) =>
    row.expiryDate.getTime() < new Date().getTime();
  return RefreshToken;
};
