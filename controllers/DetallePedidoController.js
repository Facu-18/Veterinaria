import DetallePedido from '../models/DetallePedido.js';
import flash from 'connect-flash';
import { body, check, validationResult } from 'express-validator';
import { emailConfirmarCuenta } from '../config/email.js';
import passport from 'passport';
import db from '../config/db.js';

export const crearDetallePedido = async (req, res) => {
    try {
        const detallePedido = await DetallePedido.create(req.body);
        res.status(201).json(detallePedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerDetallesPedido = async (req, res) => {
    try {
        const detallesPedido = await DetallePedido.findAll();
        res.status(200).json(detallesPedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerDetallePedido = async (req, res) => {
    try {
        const detallePedido = await DetallePedido.findByPk(req.params.id);
        if (!detallePedido) {
            return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        }
        res.status(200).json(detallePedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const actualizarDetallePedido = async (req, res) => {
    try {
        const [updated] = await DetallePedido.update(req.body, { where: { detalle_id: req.params.id } });
        if (updated === 0) {
            return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        }
        const detallePedido = await DetallePedido.findByPk(req.params.id);
        res.status(200).json(detallePedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarDetallePedido = async (req, res) => {
    try {
        const deleted = await DetallePedido.destroy({ where: { detalle_id: req.params.id } });
        if (deleted === 0) {
            return res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        }
        res.status(204).json({ message: 'Detalle de pedido eliminado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};