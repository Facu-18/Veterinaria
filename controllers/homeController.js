import Categoria from "../models/Categoria.js";
import Productos from '../models/Productos.js';
import sequelize from '../config/db.js';

const home = async (req, res) => {
    try {
        const productosDestacados = await Productos.findAll({
            order: sequelize.random(),
            limit: 3,
            include: [{ model: Categoria, as: 'categoria' }]
        });

        res.render('home', {
            nombrePagina: 'Inicio',
            layout: req.isAuthenticated() ? 'main-logged-in' : 'main',
            productosDestacados
        });

    } catch (error) {
        console.log(error);
        res.status(500).render('error', {
            nombrePagina: 'Error',
            mensaje: 'Error interno del servidor'
        });
    }
};

export {
    home
};