const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Product = sequelize.define('Product', {
  title: DataTypes.TEXT,
  price: DataTypes.TEXT,
  img: DataTypes.TEXT,
  distributor: DataTypes.TEXT,
  product: DataTypes.TEXT
});

//User.hasMany(Product, { foreignKey: 'usuario_id' });
//Product.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = Product;
