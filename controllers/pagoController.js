
// controllers/pagoController.js
import axios from 'axios';
import { mobexConfig } from '../config/mobbex.js';
import { Checkout } from 'mobbex/lib/resources/checkout.js';

export const iniciarPago = async (req, res) => {
    try {
      const data = {
        total: "10000.53",
        description: "Checkout de Prueba",
        reference: "260522021109054",
        currency: "ARS",
        test: true,
        return_url: "https://mobbex.com/return_url",
        webhook: "https://mobbex.com/webhook",
        items: [
          {
            description: "Producto Ejemplo",
            total: 100,
            quantity: 1,
            unitPrice: 100
          }
        ],
        customer: {
          email: "demo@mobbex.com",
          name: "Cliente Demo",
          identification: "12123123"
        },
        multivendor: "false",
        merchants: [
          {
            uid: "demo_uid"
          }
        ]
      };
  
      const response = await axios.post(`${mobexConfig.baseUrl}/p/checkout`, data, {
        headers: {
          'x-api-key': mobexConfig.apiKey,
          'x-access-token': mobexConfig.apiSecret,
          'Content-Type': 'application/json'
        },
      });
  
      // Verifica la respuesta en la consola
      console.log('Respuesta de Mobbex:', response.data);
  
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
        'x-api-key': process.env.MOBEX_API_KEY,
        'x-access-token': process.env.MOBEX_API_SECRET,
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error al verificar el pago:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al verificar el pago' });
  }
};
