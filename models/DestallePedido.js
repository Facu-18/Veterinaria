import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Pedido from './Pedido.js';
import Producto from './Producto.js';

const DetallePedido = db.define('DetallePedido', {
    detalle_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pedido_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Pedido,
            key: 'pedido_id'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Producto,
            key: 'producto_id'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false
});

DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id' });
Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id' });
Producto.hasMany(DetallePedido, { foreignKey: 'producto_id' });

export default DetallePedido;
