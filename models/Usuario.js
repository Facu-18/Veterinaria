import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

const Usuario = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    imagen: Sequelize.STRING(60),
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: { msg: 'Agrega un correo válido' },
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado',
        },
    },
    telefono:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: 'El numero de telefono es obligatorio'}
        },
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La contraseña no es válida' },
        },
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    rol:{
        type: Sequelize.STRING,
        defaultValue: 'usuario'
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE,
}, {
    schema: 'public', // Aquí especifica el esquema deseado
    hooks: {
        beforeCreate: async (usuario) => {
            const salt = await bcrypt.genSalt(12);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        },
    },
});

// Método para comparar password
Usuario.prototype.validarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

export default Usuario;