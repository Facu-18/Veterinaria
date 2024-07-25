import express from 'express';
import { registrarConGoogle, registrarConGoogleCallback } from '../controllers/authController.js';

const router = express.Router();

// Ruta para iniciar sesión con Google
router.get('/auth/google', registrarConGoogle);

// Ruta para el callback de Google después de la autenticación
router.get('/auth/google/callback', registrarConGoogleCallback);


export default router;