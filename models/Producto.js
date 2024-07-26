import { Sequelize } from "sequelize";
import db from '../config/db.js';
import bcrypt from 'bcrypt';

import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Categoria from './Categoria.js';

const Producto = db.define('Producto', {
    producto_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Categoria,
            key: 'categoria_id'
        }
    }
}, {
    timestamps: true, // Si deseas que Sequelize agregue los campos `createdAt` y `updatedAt`
});

// Definir la relación
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });

export default Producto;
