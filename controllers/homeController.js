import Categoria from "../models/Categoria.js";
import Productos from '../models/Productos.js';
import sequelize from '../config/db.js';
import Usuario from '../models/Usuario.js'

const home = async (req, res) => {
    try {
        const { categoria } = req.query; // Obtener la categoría desde la query string

        const usuario = req.user
        
        // Configurar las condiciones de búsqueda
        const whereCondition = categoria ? { categoriaId: categoria } : {};

        const productosDestacados = await Productos.findAll({
            where: whereCondition,
            order: sequelize.random(),
            limit: 4,
            include: [{ model: Categoria, as: 'categoria' }]
        });

        const categorias = await Categoria.findAll(); // Obtener todas las categorías para el filtro

        res.render('home', {
            nombrePagina: 'Inicio',
            layout: req.isAuthenticated() ? 'main-logged-in' : 'main',
            productosDestacados,
            categorias, // Pasar las categorías a la vista
            selectedCategoria: categoria,// Pasar la categoría seleccionada a la vista,
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).render('error', {
            nombrePagina: 'Error',
            mensaje: 'Error interno del servidor'
        });
    }
};

export { home };
