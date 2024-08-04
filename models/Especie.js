// models/Especie.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Especies = sequelize.define('especies', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Especies;