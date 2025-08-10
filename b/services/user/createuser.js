const findEmail  = require('./findEmail');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async ( name, lastname, email, password_hashed) => 
{
    try {
        if(await findEmail.findEmail(email))
            { 
                console.error('El email ya está en uso');
                return false;
            }
        const hashedPassword = await bcrypt.hash(password_hashed, 10);
        await User.create({ name, lastname, email, password_hash: hashedPassword });
        return true;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return false;
    }
} 