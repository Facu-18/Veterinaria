import Usuario from '../models/Usuario.js'
import { body, check, validationResult } from 'express-validator';
import { emailConfirmarCuenta, emailOlvidePassword } from '../config/email.js';
import { generaId } from '../helpers/token.js';
import bcrypt from 'bcrypt'


const formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear Cuenta',
        errores: [],
        datos: {}
    });
};

const crearCuenta = async (req, res) => {
    try {
        // Validación de campos
        await check('nombre').notEmpty().withMessage('El campo nombre es obligatorio').trim().escape().run(req);
        await check('email').notEmpty().withMessage('El campo email es obligatorio').isEmail().withMessage('El formato no corresponde a un email').run(req);
        await check('telefono').notEmpty().withMessage('El campo teléfono es obligatorio').isInt().withMessage('El número no es válido').isLength({ min: 10 }).withMessage('El número de teléfono debe tener al menos 10 dígitos').trim().escape().run(req);
        await check('password').notEmpty().withMessage('El campo contraseña es obligatorio').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').trim().escape().run(req);
        await check('repetir_password').notEmpty().withMessage('El campo repetir contraseña no puede ir vacío').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }).run(req);

        let resultado = validationResult(req);

        // Extraer los datos...
        const { nombre, email, telefono, password } = req.body;

        // Verificar que el resultado esté vacío...
        if (!resultado.isEmpty()) {
            // Errores...
            return res.render('crear-cuenta', {
                nombrePagina: 'Crear Cuenta',
                errores: resultado.array(),
                datos: req.body
            });
        }

        // Verificar que el usuario no esté duplicado...
        const existeUsuario = await Usuario.findOne({ where: { email } });
        if (existeUsuario) {
            return res.render('crear-cuenta', {
                nombrePagina: 'Crear Cuenta',
                errores: [{ msg: 'El usuario ya está registrado' }],
                datos: req.body
            });
        }

        // Almacenar un usuario...
        const usuario = await Usuario.create({
            nombre,
            email,
            telefono,
            password
        });

       // URL de confirmación
       const url = `http://${req.headers.host}/confirmar/${usuario.email}`;

       // Enviar mail de confirmación
       await emailConfirmarCuenta({
           email: usuario.email,
           nombre: usuario.nombre,
           url: url
       });

       res.render('mensaje',{
          nombrePagina: 'Cuenta Creada correctamente',
          mensaje: 'Cuenta Creada correctamente, hemos enviado un email para confirmar tu cuenta'
       })
   } 
   catch (error) {
       console.error('Error al crear usuario:', error);
       res.render('crear-cuenta', {
           nombrePagina: 'Crear Cuenta',
           errores: [{ msg: 'Ocurrió un error al crear la cuenta. Inténtalo de nuevo.' }],
           datos: req.body
       });
   }
};

// Confirmar cuenta
const confirmarCuenta = async (req, res, next) => {
    try {
        // verificar si el usuario existe
        const usuario = await Usuario.findOne({ where: { email: req.params.correo } });

        if (!usuario) {
            return res.render('confirmar', {
                nombrePagina: 'Error al confirmar tu cuenta',
                mensaje: 'Hubo un error al confirmar tu cuenta, por favor intenta de nuevo',
                error: true
            });
        }
        
        usuario.activo = 1,
        await usuario.save()
        
        res.render('confirmar',{
            nombrePagina: '',
            mensaje: 'La cuenta se confirmo correctamente',
            error: false
        })
        
        
    } 
    catch (error) {
        console.error('Error al confirmar usuario:', error);
       
    }
};

const formIniciarSesion = (req,res)=>{
   res.render('iniciar-sesion',{
      nombrePagina : 'Iniciar Sesion'
   })
}

const autenticar = async (req, res)=>{
    // Validación...
    await check('email').isEmail().withMessage('El formato no corresponde a un email').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio...
    if (!resultado.isEmpty()) {
        // Errores...
        return res.render('iniciar-sesion', {
            pagina: 'Iniciar Sesión',
           
            errores: resultado.array()
        })
    } 
    
    const {email, password} = req.body;
    
    // Comprobar si el usuario existe...
    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario){
        return res.render('iniciar-sesion', {
            nombrePagina: 'Iniciar Sesión',
            
            errores: [{msg:'El usuario no existe'}]
        })
    }

    // Comprobar si el suario esta confirmado...
    if(!usuario.activo){
        return res.render('iniciar-sesion', {
            nombrePagina: 'Iniciar Sesión',
            errores: [{msg:'Tu cuenta no esta confirmada'}]
        })
    }

    // Revisar password...
    if(!usuario.validarPassword(password)){
        return res.render('iniciar-sesion', {
            nombrePagina: 'Iniciar Sesión',
            errores: [{msg:'La contraseña es incorrecta'}]
        })
    }
    
    res.redirect('/home')
}

const cerrarSesion=(req,res)=>{
    req.session.destroy()
    
    res.redirect('iniciar-sesion')
}

// Controlador para mostrar el formulario de olvide-password
const formularioOlvidePassword = (req, res) => {
    res.render('olvide-password', {
        nombrePagina: 'Recupera tu acceso a VeteLiceo',
        errores: []
    });
};

const resetPassword = async (req, res) => {
    // Validacion...
    await check('email').isEmail().withMessage('El formato no corresponde a un email').run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio...
    if (!resultado.isEmpty()) {
        // Errores...
        return res.render('olvide-password', {
            nombrePagina: 'Recupera tu acceso a VeteLiceo',
            errores: resultado.array()
        });
    }

    // Buscar al usuario...
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.render('olvide-password', {
            nombrePagina: 'Recupera tu acceso a VeteLiceo',
            errores: [{ msg: 'El Email no pertenece a ningun usuario' }]
        });
    }

    // Generar token y enviar mail...
    usuario.tokenPassword = generaId();
    await usuario.save();

    // Enviar un email...
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.tokenPassword
    });

    // Renderizar un mensaje...
    res.render('mensaje', {
        nombrePagina: 'Reestablece tu contraseña',
        mensaje: 'Hemos enviado un email con las instrucciones'
    });
};


// Controlador para comprobar el token
const comprobarToken = async (req, res) => {
    const { tokenPassword } = req.params;

    const usuario = await Usuario.findOne({ where: { tokenPassword } });

    if (!usuario) {
        return res.render('confirmar', {
            nombrePagina: 'Reestablece tu contraseña',
            mensaje: 'Hubo un error al validar tus datos, porfavor intenta de nuevo',
            error: true
        });
    }

    // Mostrar formulario para modificar el password...
    res.render('reset-password', {
        nombrePagina: 'Restablece tu contraseña',
        token: usuario.tokenPassword
    });
};

// Controlador para cambiar el nuevo password
const nuevoPassword = async (req, res) => {
    // Validar el password...
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener un minimo de 8 caracteres').run(req);

    await check('repetir_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    }).run(req);

    let resultado = validationResult(req);

    // Verificar que el resultado este vacio...
    if (!resultado.isEmpty()) {
        // Errores...
        return res.render('reset-password', {
            nombrePagina: 'Restablece tu contraseña',
            errores: resultado.array(),
            token: req.params.tokenPassword
        });
    }

    const { tokenPassword } = req.params;
    const { password } = req.body;

    // Identificar quien hace el cambio...
    const usuario = await Usuario.findOne({ where: { tokenPassword } });

    if (!usuario) {
        return res.render('reset-password', {
            nombrePagina: 'Restablece tu contraseña',
            errores: [{ msg: 'Token no válido' }],
            token: tokenPassword
        });
    }

    // Hashear el nuevo password...
    const salt = await bcrypt.genSalt(12);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.tokenPassword = null;

    await usuario.save();

    res.render('confirmar', {
        nombrePagina: 'Contraseña Restablecida Correctamente',
        mensaje: 'La contraseña se cambio correctamente',
        error: false
    });
};
export{
   formCrearCuenta,
   crearCuenta,
   formIniciarSesion,
   cerrarSesion,
   confirmarCuenta,
   formularioOlvidePassword,
   resetPassword,
   comprobarToken,
   nuevoPassword
}