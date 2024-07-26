import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Categoria = db.define('Categoria', {
    categoria_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

export default Categoria;