import passport from 'passport';
import UsuarioGoogle from '../models/UsuariosGoogle.js';

const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
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

const seleccionarLayout = (req, res, next) => {
    res.locals.layout = req.isAuthenticated() ? 'main-logged-in' : 'layout';
    next();
};

export{
    registrarConGoogleCallback,
    registrarConGoogle,
    autenticarUsuario,
    usuarioAutenticado,
    seleccionarLayout
}