import passport from 'passport';
import UsuarioGoogle from '../models/UsuariosGoogle.js';
import Usuario from '../models/Usuario.js';



const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});



// Función para registrar usuarios con Google OAuth

const registrarConGoogle = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Callback de Google OAuth después de la autenticación
const registrarConGoogleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/iniciar-sesion' }, async (err, user) => {
        if (err) {
            console.error('Error al autenticar con Google:', err);
            req.flash('error', 'Error al autenticar con Google. Inténtalo de nuevo.');
            return res.redirect('/iniciar-sesion');
        }

        if (!user) {
            req.flash('error', 'No se recibió información del usuario desde Google.');
            return res.redirect('/iniciar-sesion');
        }

        req.login(user, (loginErr) => {
            if (loginErr) {
                console.error('Error al iniciar sesión:', loginErr);
                req.flash('error', 'Error al iniciar sesión. Inténtalo de nuevo.');
                return res.redirect('/iniciar-sesion');
            }
            return res.redirect('/');
        });
    })(req, res, next);
};



const usuarioAutenticado = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }

    // si no esta autenticado
    return res.redirect('/iniciar-sesion')
}

const usuarioAdmin = async (req, res, next) => {
    try {
        // Verifica si el usuario está autenticado
        if (!req.isAuthenticated()) {
            return res.redirect('/iniciar-sesion'); // Redirige si no está autenticado
        }

        // Obtén el usuario autenticado
        const usuario = await Usuario.findByPk(req.user.id); // Ajusta el método para obtener el usuario autenticado

        // Verifica si el usuario tiene el rol de admin
        if (usuario && usuario.rol === 'admin') {
            req.usuario = usuario; // Almacena el usuario en req.usuario
            return next(); // Permite el acceso a la ruta
        } else {
            return res.status(403).send('Acceso denegado'); // O redirige a una página de acceso denegado
        }
    } catch (error) {
        console.error('Error en el middleware de verificación de rol:', error);
        return res.status(500).send('Error en el servidor');
    }
};
const seleccionarLayout = (req, res, next) => {
    res.locals.layout = req.isAuthenticated() ? 'main-logged-in' : 'layout';
    next();
};

export{
    registrarConGoogleCallback,
    registrarConGoogle,
    autenticarUsuario,
    usuarioAutenticado,
    seleccionarLayout,
    usuarioAdmin
}