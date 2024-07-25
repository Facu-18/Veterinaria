// models/UsuarioGoogle.js
import { Sequelize } from 'sequelize';
import db from '../config/db.js';

const UsuarioGoogle = db.define('usuarios_google', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    googleId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    nombre: Sequelize.STRING,
    imagen: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
});

export default UsuarioGoogle;