import express from 'express'
import { home} from '../controllers/homeController.js';
import { formCrearCuenta, crearCuenta, formIniciarSesion, confirmarCuenta, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword, cerrarSesion} from '../controllers/usuariosController.js';
import {autenticarUsuario, usuarioAutenticado, seleccionarLayout, usuarioAdmin} from '../controllers/authController.js'
//import authRoutes from './authRoutes.js';
import {subirImagen, crearProducto , guardar, mostrarProductos, verProducto, editarProducto, guardarCambios,eliminar } from '../controllers/productosController.js';
import {admin} from '../controllers/adminController.js'
import{agregarAlCarrito, eliminarDelCarrito, verCarrito} from '../controllers/carritoController.js'
import { iniciarPago, verificarPago } from '../controllers/pagoController.js';
import {obtenerHorariosDisponibles, reservarTurno, mostrarFormularioTurno, getTurnosUsuarios, getTurnosAdmin, formEditarTurno, actualizarTurno, eliminarTurno} from '../controllers/turnosController.js'


const router = express.Router();

router.get('/', seleccionarLayout, home,)
    
// Crear y confirmar cuentas
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', crearCuenta)

router.get('/mensaje')
router.get('/confirmar/:correo', confirmarCuenta)

// Iniciar sesion
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)
router.post('/cerrar-sesion',cerrarSesion)

// reset password
router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword);

// Almacena el nuevo password...
router.get('/olvide-password/:tokenPassword', comprobarToken)
router.post('/olvide-password/:tokenPassword', nuevoPassword)


// Ruta de productos
router.get('/crear-producto',seleccionarLayout, usuarioAdmin, crearProducto)
router.post('/crear-producto',seleccionarLayout, usuarioAdmin, subirImagen, guardar)
router.get('/productos', seleccionarLayout, usuarioAutenticado, mostrarProductos, seleccionarLayout)
router.get('/productos/:id', seleccionarLayout, usuarioAutenticado, verProducto, seleccionarLayout)

router.get('/editar-producto/:id',
    usuarioAdmin,
    seleccionarLayout,
    editarProducto
)

router.post('/editar-producto/:id',
    usuarioAdmin,
    seleccionarLayout,
    subirImagen,
    guardarCambios)

router.post('/eliminar-producto/:id', usuarioAdmin, eliminar)
// Rutas de autenticación


// Panel de administracion
router.get('/administracion',seleccionarLayout, usuarioAdmin, admin)

// Rutas del carrito de compras
router.post('/carrito/agregar', usuarioAutenticado, agregarAlCarrito, seleccionarLayout);
router.get('/carrito', usuarioAutenticado,seleccionarLayout, verCarrito );
router.post('/carrito/eliminar/:id', usuarioAutenticado, eliminarDelCarrito, seleccionarLayout);

router.post('/pagar', iniciarPago);
router.get('/pagar', iniciarPago)
router.get('/verificar', verificarPago);



// turnero
router.get('/sacar-turno', usuarioAutenticado, seleccionarLayout, mostrarFormularioTurno);
router.get('/horarios-disponibles/:fecha', usuarioAutenticado, obtenerHorariosDisponibles);
router.post('/sacar-turno', usuarioAutenticado, seleccionarLayout, reservarTurno);
router.get('/turnos', usuarioAutenticado, seleccionarLayout, getTurnosUsuarios)
router.get('/turnos/:id', usuarioAutenticado, seleccionarLayout, getTurnosUsuarios)
router.get('/turnos-admin', usuarioAdmin, getTurnosAdmin)

//editar y eliminar los turnos
router.get('/editar-turno/:id', usuarioAutenticado, seleccionarLayout, formEditarTurno )
router.post('/editar-turno/:id', usuarioAutenticado, seleccionarLayout, actualizarTurno);
router.post('/eliminar-turno/:id',usuarioAutenticado, seleccionarLayout, eliminarTurno)

export default router;