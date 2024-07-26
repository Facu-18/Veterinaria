import Pedido from '../models/Pedido.js';
import flash from 'connect-flash';
import { body, check, validationResult } from 'express-validator';
import { emailConfirmarCuenta } from '../config/email.js';
import passport from 'passport';
import db from '../config/db.js';

export const crearPedido = async (req, res) => {
    try {
        const pedido = await Pedido.create(req.body);
        res.status(201).json(pedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json(pedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.update(req.body, { where: { pedido_id: req.params.id } });
        if (!pedido[0]) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido actualizado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.destroy({ where: { pedido_id: req.params.id } });
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
