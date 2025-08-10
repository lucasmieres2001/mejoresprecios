const User = require('../../models/User');

exports.getAllUsers = async () => {
    try {
        const users = await User.findAll();
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw new Error('Error al obtener usuarios');
        }
    }