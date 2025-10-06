const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tracking = sequelize.define('Tracking', {
  userId: DataTypes.INTEGER,
  productId: DataTypes.INTEGER,
  action: DataTypes.STRING
});

module.exports = Tracking;