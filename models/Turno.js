import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Asegúrate de importar tu instancia de Sequelize
import Usuario from './Usuario.js';



const Turno = sequelize.define('Turno', {
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    dni:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: 'El numero de documento es obligatorio'}
        },
    },
    nombreMascota: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    especieMascota: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    razaMascota: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default Turno;

Usuario.hasMany(Turno, { onDelete: 'CASCADE' });
Turno.belongsTo(Usuario);