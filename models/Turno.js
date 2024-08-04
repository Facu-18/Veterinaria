import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Usuario from './Usuario.js';
import Mascota from './Mascota.js';

const Turno = sequelize.define('Turno', {

    turno_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fecha_turno: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },

    mascota_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Mascota,
            key: 'mascota_id'
        }
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
Usuario.hasMany(Turno, { foreignKey: 'usuario_id' });
Turno.belongsTo(Usuario, { foreignKey: 'usuario_id' })

export default Turno;