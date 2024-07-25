import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path: '.env'})


const db = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASSWORD,{
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'postgres',
    Pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000

    },
    logging: console.log
})

export default db