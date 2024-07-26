import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Mascota from './Mascota.js';

const Turno = db.define('Turno', {
    turno_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    mascota_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Mascota,
            key: 'mascota_id'
        }
    },
    fecha_turno: {
        type: DataTypes.DATE,
        allowNull: false
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

Turno.belongsTo(Mascota, { foreignKey: 'mascota_id' });
Mascota.hasMany(Turno, { foreignKey: 'mascota_id' });

export default Turno;
