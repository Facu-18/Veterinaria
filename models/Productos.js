import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';

const Producto = db.define('Producto', {
  id: {
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
  imagen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Categoria,
      key: 'id'
    }
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Definir relaciones
Producto.belongsTo(Categoria, { as: 'categoria', foreignKey: 'categoriaId' });
Categoria.hasMany(Producto, { as: 'productos', foreignKey: 'categoriaId' });

Producto.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(Producto, { foreignKey: 'usuarioId' });

export default Producto;
