import express from 'express'
import { home } from '../controllers/homeController.js';
import { formCrearCuenta, crearCuenta, formIniciarSesion, confirmarCuenta, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword} from '../controllers/usuariosController.js';
import {autenticarUsuario, usuarioAutenticado, seleccionarLayout, usuarioAdmin} from '../controllers/authController.js'
import authRoutes from './authRoutes.js';
import {subirImagen, crearProducto , guardar, } from '../controllers/productosController.js';
import {admin} from '../controllers/adminController.js'


const router = express.Router();

router.get('/', seleccionarLayout, home)
    
// Crear y confirmar cuentas
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', crearCuenta)

router.get('/mensaje')
router.get('/confirmar/:correo', confirmarCuenta)

// Iniciar sesion
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)

// reset password
router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword);

// Almacena el nuevo password...
router.get('/olvide-password/:tokenPassword', comprobarToken)
router.post('/olvide-password/:tokenPassword', nuevoPassword)


// Ruta de productos
router.get('/crear-producto', usuarioAdmin, crearProducto)
router.post('/crear-producto', usuarioAdmin, subirImagen, guardar)

// Rutas de autenticación
router.use('/auth', authRoutes);

// Panel de administracion
router.get('/administracion', usuarioAdmin, admin)

export default router;