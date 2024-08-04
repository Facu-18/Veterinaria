import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Usuario from './Usuario.js';
import Especie from './Especie.js'
import Raza from './Raza.js'

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
    especie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Especie,
          key: 'id',
        },
      },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id'
        
        }
    }
}, 
{
    timestamps: false
});

Mascota.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Mascota, { foreignKey: 'usuario_id' });
Mascota.hasMany(Especie, {foreignKey: 'especie_id'});
Especie.belongsTo(Mascota, {foreignKey: 'especie_id'})


export default Mascota;