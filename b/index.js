require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const puerto = process.env.PORT || 8080;
const productRoutes = require('./routes/scrapping');
const userRoutes = require('./routes/user'); // Importa las rutas de usuario
const sequelize = require('./config/db'); // Importa la configuración de Sequelize

// Cors
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}))

// Middleware
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

// Sincroniza la base de datos y luego inicia el servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(puerto, () => {
      console.log(`Servidor escuchando en http://localhost:${puerto}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar DB:', err);
  });