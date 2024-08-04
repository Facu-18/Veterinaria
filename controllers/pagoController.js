import axios from 'axios';
import { mobexConfig } from '../config/mobbex.js';
import Producto from '../models/Productos.js';
import Carrito from '../models/Carrito.js';
import { enviarEmailConfirmacionPago } from '../config/email.js';
import nodemailer from 'nodemailer';
import { generarReference } from '../helpers/reference.js';


export const iniciarPago = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const carritoItems = await Carrito.findAll({
      where: { usuarioId },
      include: [{ 
        model: Producto,
        as: 'producto'
      }]
    });

    if (carritoItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    let total = 0;
    const items = carritoItems.map(item => {
      const producto = item.producto;
      const itemTotal = producto.precio * item.cantidad;
      total += itemTotal;
      return {
        description: producto.nombre,
        total: itemTotal,
        quantity: item.cantidad,
        unitPrice: producto.precio
      };
    });

    const paymentMethods = [
      { type: "debit_card", description: "Tarjeta de Débito" },
      { type: "credit_card", description: "Tarjeta de Crédito" },
      { type: "bank_transfer", description: "Transferencia Bancaria" },
      { type: "ticket", description: "Pago en Efectivo" },
      { type: "wallet", description: "Billetera Digital" }
    ];

    const data = {
      total: total.toFixed(2),
      description: "Checkout de Productos",
      reference: generarReference(10),
      currency: "ARS",
      test: true,
      return_url: "https://mobbex.com/return_url",
      webhook: "https://mobbex.com/webhook",
      items: items,
      customer: {
        email: req.user.email,
        name: req.user.nombre,
        phone: req.user.telefono
      },
      multivendor: "false",
      merchants: [
        {
          uid: "demo_uid"
        }
      ],
      paymentMethods: paymentMethods
    };

    const response = await axios.post(`${mobexConfig.baseUrl}/p/checkout`, data, {
      headers: {
        'x-api-key': mobexConfig.apiKey,
        'x-access-token': mobexConfig.apiSecret,
        'Content-Type': 'application/json'
      },
    });

    // Verifica la respuesta en la consola
    console.log('Respuesta de Mobbex:', JSON.stringify(response.data, null, 2));

    if (response.data.result && response.data.data && response.data.data.url) {
      res.render('checkout', { 
          nombrePagina: 'Confirma tu Pago',
          checkoutUrl: response.data.data.url 
      });
    } else {
      throw new Error('No se recibió la URL del checkout');
    }

  } catch (error) {
    console.error('Error al iniciar el pago:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al iniciar el pago' });
  }
};

export const verificarPago = async (req, res) => {
  try {
    const { pagoId } = req.query;

    const response = await axios.get(`${mobexConfig.baseUrl}/${pagoId}`, {
      headers: {
        'x-api-key': mobexConfig.apiKey,
        'x-access-token': mobexConfig.apiSecret,
      }
    });

    // Verifica el estado del pago
    if (response.data.result && response.data.data.status === 'approved') {
      const usuarioId = req.user.id;

      // Obtener los productos del carrito antes de eliminarlo
      const carritoItems = await Carrito.findAll({
        where: { usuarioId },
        include: [{ 
          model: Producto,
          as: 'producto'
        }]
      });

      // Eliminar los productos del carrito
      await Carrito.destroy({
        where: { usuarioId }
      });

      // Enviar email de confirmación
      const productos = carritoItems.map(item => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.producto.precio
      }));

      const emailDatos = {
        email: req.user.email,
        nombre: req.user.nombre,
        total: response.data.data.total,
        productos: productos
      };

      await enviarEmailConfirmacionPago(emailDatos);

      res.json({ message: 'Pago verificado, productos eliminados del carrito y email enviado' });
    } else {
      res.status(400).json({ error: 'Pago no aprobado' });
    }

  } catch (error) {
    console.error('Error al verificar el pago:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al verificar el pago' });
  }
};