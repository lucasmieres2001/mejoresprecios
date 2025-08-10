const User = require('../../models/User');

exports.findEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } }); // ✅ corregido
        return !!user;
    } catch (error) {
        console.error('Error al verificar email:', error);
        return false;
    }
};
