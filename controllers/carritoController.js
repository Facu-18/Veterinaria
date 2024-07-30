// controllers/carritoController.js
import Carrito from '../models/Carrito.js';
import Producto from '../models/Productos.js';

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
    const usuarioId = req.user.id;
    const carrito = await Carrito.findAll({ where: { usuarioId }, include: Producto });

    res.render('carrito', { 
        carrito,
        nombrePagina:'Tu Carrito'
    });
};

export const eliminarDelCarrito = async (req, res) => {
    const { id } = req.params;

    const carritoItem = await Carrito.findByPk(id);
    if (carritoItem) {
        await carritoItem.destroy();
    }

    res.redirect('/carrito');
};
