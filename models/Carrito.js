// models/Carrito.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Usuario from './Usuario.js';
import Producto from './Productos.js';

const Carrito = sequelize.define('Carrito', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});


export default Carrito;
