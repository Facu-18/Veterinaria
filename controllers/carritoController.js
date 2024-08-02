// controllers/carritoController.js
// import Carrito from '../models/Carrito.js';
// import Producto from '../models/Productos.js';
import {Carrito, Producto, Usuario}  from '../models/Index.js'

export const agregarAlCarrito = async (req, res) => {
    const { productoId } = req.body;
    const usuarioId = req.user.id;

    let carrito = await Carrito.findOne({ where: { productoId, usuarioId } });

    if (carrito) {
        carrito.cantidad += 1;
        await carrito.save();
    } else {
        carrito = await Carrito.create({ productoId, usuarioId });
    }

    res.redirect('/carrito');
};

export const verCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        // Obtener todos los productos en el carrito del usuario
        const carrito = await Carrito.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Producto,
                    as: 'Producto' // Asegúrate de que este alias coincida con el definido en las asociaciones
                }
            ]
        });

        res.render('carrito', { carrito, nombrePagina: 'Carrito de Compras' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el carrito');
    }
};

export const eliminarDelCarrito = async (req, res) => {
    const { id } = req.params;

    const carritoItem = await Carrito.findByPk(id);
    if (carritoItem) {
        await carritoItem.destroy();
    }

    res.redirect('/carrito');
};
