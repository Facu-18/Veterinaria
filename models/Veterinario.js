import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Veterinario = db.define('Veterinario', {
    veterinario_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_contratacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

export default Veterinario;
