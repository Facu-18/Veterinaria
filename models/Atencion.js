import { DataTypes } from "sequelize";
import db from '../config/db.js';
import Turno from './Turno.js';
import Veterinario from './Veterinario.js';

const Atencion = db.define('Atencion', {
    atencion_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    turno_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Turno,
            key: 'turno_id'
        }
    },
    veterinario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Veterinario,
            key: 'veterinario_id'
        }
    },
    diagnostico: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tratamiento: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false
});

Atencion.belongsTo(Turno, { foreignKey: 'turno_id' });
Atencion.belongsTo(Veterinario, { foreignKey: 'veterinario_id' });
Turno.hasMany(Atencion, { foreignKey: 'turno_id' });
Veterinario.hasMany(Atencion, { foreignKey: 'veterinario_id' });

export default Atencion;
