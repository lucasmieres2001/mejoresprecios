const { createUser } = require("../services/user/createuser");

// Registrar nuevo usuario
async function controllerCreateUser(req, res) {
  console.log('Datos del usuario:', req.body);
  const { name, lastname, email, password } = req.body;
  await createUser(name, lastname, email, password) ? 
  res.status(201).json({ message: 'Usuario creado exitosamente' }) : 
  res.status(500).json({ error: 'Error al crear usuario' });
}

// Obtener todos los usuarios
async function controllerGetAllUsers(req, res) {
  const users = await getAllUsers();
  res.json(users);
}

module.exports = {
  controllerCreateUser,
  controllerGetAllUsers,
};
