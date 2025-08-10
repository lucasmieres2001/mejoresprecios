const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./product');

const PriceHistory = sequelize.define('PriceHistory', {
  precio: DataTypes.DECIMAL(10, 2),
  en_stock: DataTypes.BOOLEAN
});

Product.hasMany(PriceHistory, { foreignKey: 'producto_id' });
PriceHistory.belongsTo(Product, { foreignKey: 'producto_id' });

module.exports = PriceHistory;
