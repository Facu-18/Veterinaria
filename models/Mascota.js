import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Cliente from './Cliente.js';

const Mascota = db.define('Mascota', {
    mascota_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    raza: {
        type: DataTypes.STRING,
        allowNull: true
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'cliente_id'
        }
    }
}, {
    timestamps: false
});

Mascota.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Mascota, { foreignKey: 'cliente_id' });

export default Mascota;
