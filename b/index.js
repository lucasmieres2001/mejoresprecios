require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const puerto = process.env.PORT || 8080;
const productRoutes = require('./routes/scrapping');
const userRoutes = require('./routes/user');
const { sequelize, User, Product, Tracking } = require('./models'); // Importa desde models/index.js

// Cors y middleware...
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

// Sincroniza la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    console.log('Tablas creadas:', Object.keys(sequelize.models));
    app.listen(puerto, () => {
      console.log(`Servidor escuchando en http://localhost:${puerto}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar DB:', err);
  });