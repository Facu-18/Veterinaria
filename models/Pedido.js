
import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Usuario from './Usuario.js';

const Pedido = db.define('Pedido', {
    pedido_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'usuario_id'
        }
    },
    fecha_pedido: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });

export default Pedido;
