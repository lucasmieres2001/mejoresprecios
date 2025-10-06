const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  title: DataTypes.TEXT,
  price: DataTypes.TEXT,
  discountType: DataTypes.TEXT,
  img: DataTypes.TEXT,
  url: DataTypes.TEXT,
  distributor: DataTypes.TEXT,
  product: DataTypes.TEXT,
  stock: DataTypes.INTEGER
});

//User.hasMany(Product, { foreignKey: 'usuario_id' });
//Product.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = Product;
