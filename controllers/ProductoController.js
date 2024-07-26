import Producto from '../models/Producto.js';
import flash from 'connect-flash';
import { body, check, validationResult } from 'express-validator';
import { emailConfirmarCuenta } from '../config/email.js';
import passport from 'passport';
import db from '../config/db.js';

export const crearProducto = async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.update(req.body, { where: { producto_id: req.params.id } });
        if (!producto[0]) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.destroy({ where: { producto_id: req.params.id } });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
