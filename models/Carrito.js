import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Usuario from './Usuario.js';
import Producto from './Productos.js';

const Carrito = db.define('Carrito', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  productoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Producto,
      key: 'id'
    }
  }
});

// Definir relaciones
Carrito.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuarioId' });
Usuario.hasMany(Carrito, { as: 'carritos', foreignKey: 'usuarioId' });

Carrito.belongsTo(Producto, { as: 'producto', foreignKey: 'productoId' });
Producto.hasMany(Carrito, { as: 'carritos', foreignKey: 'productoId' });

export default Carrito;
