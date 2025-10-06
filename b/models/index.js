const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./product');
const Tracking = require('./tracking');

// Si tienes relaciones, descomenta y configura aquí:
// User.hasMany(Product, { foreignKey: 'usuario_id' });
// Product.belongsTo(User, { foreignKey: 'usuario_id' });

const models = {
  User,
  Product,
  Tracking
};

module.exports = {
  sequelize,
  ...models
};