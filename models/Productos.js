import { Sequelize } from "sequelize";
import db from '../config/db.js';
import Categoria from './Categoria.js';
import Usuario from "./Usuario.js";

const Producto = db.define('productos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    precio: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    imagen:{
       type: Sequelize.STRING,
       allowNull: false
    },
    stock: {
        type: Sequelize.INTEGER,
    },
    categoriaId: {
        type: Sequelize.INTEGER,
        references: {
            model: Categoria,
            key: 'id'
        }
    }
}, {
    timestamps: true, // Si deseas que Sequelize agregue los campos `createdAt` y `updatedAt`
});

// Definir la relación
Producto.belongsTo(Categoria, {as: 'categoria', foreignKey: 'categoriaId' });
Categoria.hasMany(Producto, {as: 'categorias', foreignKey: 'categoriaId' });
Producto.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(Producto, { foreignKey: 'usuarioId' });

export default Producto;