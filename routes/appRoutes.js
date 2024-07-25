import express from 'express'
import { home } from '../controllers/homeController.js';
import { formCrearCuenta, crearCuenta, formIniciarSesion, confirmarCuenta } from '../controllers/usuariosController.js';
import {autenticarUsuario, usuarioAutenticado, seleccionarLayout} from '../controllers/authController.js'
import authRoutes from './authRoutes.js';
//import {panelAdministracion} from '../controllers/adminController.js'


const router = express.Router();

router.get('/', seleccionarLayout, home)
    
// Crear y confirmar cuentas
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', crearCuenta)
router.get('/confirmar-cuenta/:correo', confirmarCuenta)

// Iniciar sesion
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)

// Rutas de autenticación
router.use('/auth', authRoutes);

// Panel de administracion
//router.get('/administracion', usuarioAutenticado, panelAdministracion)

export default router;