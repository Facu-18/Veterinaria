// models/index.js

import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

// Importar modelos
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';
import Producto from './Productos.js';
import Carrito from './Carrito.js';

// Definir relaciones

// Relación entre Usuario y Producto
Usuario.hasMany(Producto, { foreignKey: 'usuarioId' });
Producto.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Relación entre Producto y Categoria
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(Producto, { as: 'productos', foreignKey: 'categoriaId' });

// Relación entre Usuario y Carrito
Usuario.hasMany(Carrito, { foreignKey: 'usuarioId' });
Carrito.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Relación entre Producto y Carrito
Producto.hasMany(Carrito, { foreignKey: 'productoId', as: 'Carritos' });
Carrito.belongsTo(Producto, { foreignKey: 'productoId', as: 'Producto' });

// Exportar todos los modelos
export { Categoria, Usuario, Producto, Carrito, sequelize as db };
