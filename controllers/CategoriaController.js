import Categoria from '../models/Categoria.js';
import flash from 'connect-flash';
import { body, check, validationResult } from 'express-validator';
import { emailConfirmarCuenta } from '../config/email.js';
import passport from 'passport';
import db from '../config/db.js';

export const crearCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.create(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.update(req.body, { where: { categoria_id: req.params.id } });
        if (!categoria[0]) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.destroy({ where: { categoria_id: req.params.id } });
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
