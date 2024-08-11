import Turno from '../models/Turno.js';
import Usuario from '../models/Usuario.js';
import { generarHorariosDisponibles } from '../helpers/horarios.js';
import { check, validationResult } from 'express-validator';

// Función para renderizar la vista de agendar turno
export const mostrarFormularioTurno = (req, res) => {
    const usuario = req.user.id; // O como lo tengas definido en tu sistema de autenticación
    
    res.render('sacar-turno', {
        nombrePagina: 'Reserva tu Turno',
        horariosFiltrados: [], // Inicialmente vacío, se llenará dinámicamente con JavaScript
        datos: {},
        errores: [],
        usuario // Pasamos el usuario a la vista
    });
};

// Función para obtener los horarios disponibles
export const obtenerHorariosDisponibles = async (req, res) => {
    const { fecha } = req.params;

    if (!fecha) {
        return res.status(400).json({ error: 'Fecha no proporcionada' });
    }

    const diaDeLaSemana = new Date(fecha).getDay();
    const horariosDisponibles = generarHorariosDisponibles(diaDeLaSemana);

    const turnosReservados = await Turno.findAll({
        where: { fecha },
        attributes: ['hora']
    });

    const horariosFiltrados = horariosDisponibles.filter(horario => 
        !turnosReservados.some(reservado => reservado.hora === horario)
    );

    res.json({ horariosDisponibles: horariosFiltrados });
};

// Función para reservar un turno
export const reservarTurno = async (req, res) => {
    // Validación de los datos
    await check('fecha').isDate().withMessage('La fecha debe ser una fecha válida').run(req);
    await check('hora').notEmpty().withMessage('La hora es obligatoria').run(req);
    await check('dni').isInt().notEmpty().isLength({ min: 8 }).withMessage('El documento es obligatorio').run(req);
    await check('nombreMascota').trim().notEmpty().withMessage('El nombre de la mascota es obligatorio').escape().run(req);
    await check('especieMascota').trim().notEmpty().withMessage('La especie de la mascota es obligatoria').escape().run(req);
    await check('razaMascota').trim().notEmpty().withMessage('La raza de la mascota es obligatoria').escape().run(req);

    const resultado = validationResult(req);

    const { fecha, hora, nombreMascota, especieMascota, razaMascota, dni} = req.body;
    const usuarioId = req.user.id;

    if (!resultado.isEmpty()) {
        return res.render('sacar-turno', {
            nombrePagina: 'Reserva tu Turno',
            horariosFiltrados: [], // Podrías intentar recalcular los horarios aquí si es necesario
            datos: req.body,
            errores: resultado.array(),
            usuario: req.user // Pasamos el usuario a la vista
        });
    }
    console.log(resultado.array())

    const turnoExistente = await Turno.findOne({ where: { fecha, hora } });
    if (turnoExistente) {
        return res.render('sacar-turno', {
            nombrePagina: 'Reserva tu Turno',
            horariosFiltrados: [], // Podrías intentar recalcular los horarios aquí si es necesario
            datos: req.body,
            errores: [{ msg: 'Este turno ya está reservado.' }],
            usuario: req.user
        });
    }

    await Turno.create({
        fecha,
        hora,
        nombreMascota,
        especieMascota,
        razaMascota,
        usuarioId,
        dni
    });

    res.redirect('/turnos');
};

// Función para renderizar la vista de turnos del usuario
export const getTurnosUsuarios = async (req, res) => {
    const usuarioId = req.user.id;

    const turnos = await Turno.findAll({
        where: { usuarioId },
        order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    res.render('turnos', {
        nombrePagina: 'Mis Turnos',
        turnos
    });
};

// Función para renderizar la vista de turnos del administrador
export const getTurnosAdmin = async (req, res) => {
    const { dni } = req.query; // Obtener el DNI desde la query string

    // Configurar las condiciones de búsqueda
    const whereCondition = dni ? { dni } : {};

    const turnos = await Turno.findAll({
        where: whereCondition, // Filtrar por DNI si está presente
        include: {
            model: Usuario,
            attributes: ['nombre'] // Incluir solo el nombre del usuario
        },
        order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    res.render('turnos-admin', {
        nombrePagina: 'Turnos de Usuarios',
        turnos,
        dni // Pasar el DNI a la vista para mantener el filtro en el campo de búsqueda
    });
};

export const formEditarTurno = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el turno por ID
        const turno = await Turno.findByPk(id);

        if (!turno) {
            return res.status(404).render('error', {
                nombrePagina: 'Error',
                mensaje: 'Turno no encontrado'
            });
        }

        // Verificar que el usuario autenticado sea el dueño del turno
        if (turno.usuarioId !== req.user.id) {
            return res.status(403).render('error', {
                nombrePagina: 'Acceso Denegado',
                mensaje: 'No tienes permisos para modificar este turno'
            });
        }

        // Obtener horarios disponibles para la fecha del turno
        const diaDeLaSemana = new Date(turno.fecha).getDay();
        const horariosDisponibles = generarHorariosDisponibles(diaDeLaSemana);

        // Obtener turnos reservados en la misma fecha para filtrar los horarios disponibles
        const turnosReservados = await Turno.findAll({
            where: { fecha: turno.fecha },
            attributes: ['hora']
        });

        const horariosFiltrados = horariosDisponibles.filter(horario => 
            !turnosReservados.some(reservado => reservado.hora === horario)
        );

        res.render('editar-turno', {
            nombrePagina: 'Modifica tu turno',
            turno, // Pasar el turno al formulario
            horariosFiltrados,
            errores: [],
            usuario: req.user
        });

    } catch (error) {
        console.log(error);
        res.status(500).render('error', {
            nombrePagina: 'Error',
            mensaje: 'Error interno del servidor'
        });
    }
};

export const actualizarTurno = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora, nombreMascota, especieMascota, razaMascota } = req.body;
    const resultado = validationResult(req);

    try {
        // Validación de los datos
        await check('fecha').isDate().withMessage('La fecha debe ser una fecha válida').run(req);
        await check('hora').notEmpty().withMessage('La hora es obligatoria').run(req);
        await check('dni').isInt().notEmpty().isLength({ min: 8 }).withMessage('El documento es obligatorio').run(req);
        await check('nombreMascota').trim().notEmpty().withMessage('El nombre de la mascota es obligatorio').escape().run(req);
        await check('especieMascota').trim().notEmpty().withMessage('La especie de la mascota es obligatoria').escape().run(req);
        await check('razaMascota').trim().notEmpty().withMessage('La raza de la mascota es obligatoria').escape().run(req);

        if (!resultado.isEmpty()) {
            // Volver a renderizar el formulario con los errores y datos previos
            const turno = await Turno.findByPk(id);
            const diaDeLaSemana = new Date(turno.fecha).getDay();
            const horariosDisponibles = generarHorariosDisponibles(diaDeLaSemana);

            const turnosReservados = await Turno.findAll({
                where: { fecha: turno.fecha },
                attributes: ['hora']
            });

            const horariosFiltrados = horariosDisponibles.filter(horario => 
                !turnosReservados.some(reservado => reservado.hora === horario)
            );

            return res.render('editar-turno', {
                nombrePagina: 'Modifica tu turno',
                turno,
                horariosFiltrados,
                errores: resultado.array(),
                usuario: req.user
            });
        }

        // Buscar y actualizar el turno
        const turno = await Turno.findByPk(id);
        if (!turno) {
            return res.status(404).render('error', {
                nombrePagina: 'Error',
                mensaje: 'Turno no encontrado'
            });
        }

        turno.fecha = fecha;
        turno.hora = hora;
        turno.nombreMascota = nombreMascota;
        turno.especieMascota = especieMascota;
        turno.razaMascota = razaMascota;

        await turno.save(); // Guardar los cambios

        // Redirigir o mostrar un mensaje de éxito
        res.redirect('/turnos');

    } catch (error) {
        console.log(error);
        res.status(500).render('error', {
            nombrePagina: 'Error',
            mensaje: 'Error interno del servidor'
        });
    }
};

export const eliminarTurno = async (req, res) => {
    const { id } = req.params;

    // Validar que el turno exista
    const turno = await Turno.findByPk(id);

    if (!turno) {
        return res.redirect('/turnos');
    }

    // Revisar quién visita la URL es el dueño del turno
    if (turno.usuarioId.toString() !== req.user.id.toString()) {
        return res.redirect('/turnos');
    }

    // Eliminar el turno
    await Turno.destroy({ where: { id: turno.id } }); // Agregando la condición where para eliminar el turno específico

    res.redirect('/turnos');
};