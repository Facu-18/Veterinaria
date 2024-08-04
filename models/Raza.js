// models/Raza.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Raza = sequelize.define('Raza', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export default Raza;