import Turno from '../models/Turno.js';
import Mascota from '../models/Mascota.js';
import { check, validationResult } from 'express-validator';
import moment from 'moment';
import Usuario from '../models/Usuario.js';

// Controlador para los turnos de los usuarios
export const getTurnosUsuarios = async (req, res) => {
  try {
      const turnos = await Turno.findAll({
          where: { usuario_id: req.user.id },
          include: [Mascota]
      });

      res.render('turnos', { 
          turnos,
          nombrePagina: 'Mis Turnos',
          errores: [],
          datos: {}
      });
  } catch (error) {
      console.error('Error al obtener los turnos:', error);
      res.status(500).send('Error al obtener los turnos');
  }
};

// Controlador para los turnos de admin
export const getTurnosAdmin = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [
        {
          model: Mascota,
          as: 'Mascotum',  // Asegúrate de que este alias coincide con el que usas en la vista
          attributes: ['nombre']
        },
        {
          model: Usuario,
          as: 'usuario',  // Asegúrate de que este alias coincide con el que usas en la vista
          attributes: ['nombre']
        }
      ]
    });

    res.render('turnos-admin', { 
      turnos,
      nombrePagina: 'Turnos de Todos los Usuarios',
      errores: [],
      datos: {}
    });
  } catch (error) {
    console.error('Error al obtener los turnos:', error);
    res.status(500).send('Error al obtener los turnos');
  }
};

export const getTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll();
    const mascotas = await Mascota.findAll({ where: { usuario_id: req.user.id } });
    
    if (!mascotas || mascotas.length === 0) {
      return res.redirect('/registrar-mascota');
    }

    res.render('sacar-turno', { 
      turnos,
      mascotas,
      nombrePagina: 'Saca Tu Turno',
      errores: [],
      datos: {}
    });
  } catch (error) {
    console.error('Error al obtener los turnos:', error);
    res.status(500).send('Error al obtener los turnos');
  }
};

export const addTurno = async (req, res) => {
  const { fecha_turno, hora, cliente, motivo, mascota_id } = req.body;
  const usuario_id = req.user.id;

  // Validaciones
  await check('fecha_turno')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('Fecha no válida')
    .custom((value) => {
      if (moment(value).isBefore(moment(), 'day')) {
        throw new Error('La fecha no puede ser en el pasado');
      }
      return true;
    })
    .run(req);

  await check('hora')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('La hora es obligatoria')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Hora no válida')
    .run(req);

  await check('cliente')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('El nombre del cliente es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre del cliente debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('El nombre del cliente solo puede contener letras y espacios')
    .run(req);

  await check('mascota_id')
    .notEmpty()
    .withMessage('La mascota es obligatoria')
    .isInt()
    .withMessage('ID de mascota no válido')
    .run(req);

  await check('motivo')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('El motivo es obligatorio')
    .run(req);

  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const mascotas = await Mascota.findAll({ where: { usuario_id } }); // Volver a obtener mascotas
    return res.render('sacar-turno', {
      nombrePagina: 'Saca Tu Turno',
      turnos: [],
      mascotas,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  // Verificar si la mascota existe y pertenece al usuario
  const mascota = await Mascota.findOne({ where: { mascota_id, usuario_id } });

  if (!mascota) {
    const mascotas = await Mascota.findAll({ where: { usuario_id } }); // Volver a obtener mascotas
    return res.render('sacar-turno', {
      nombrePagina: 'Saca Tu Turno',
      turnos: [],
      mascotas,
      errores: [{ msg: 'La mascota es obligatoria o no pertenece al usuario.' }],
      datos: req.body,
    });
  }

  // Verificar si ya hay un turno registrado para la misma fecha y hora
  const turnoExistente = await Turno.findOne({
    where: { fecha_turno, hora, usuario_id }
  });

  if (turnoExistente) {
    const mascotas = await Mascota.findAll({ where: { usuario_id } }); // Volver a obtener mascotas
    return res.render('sacar-turno', {
      nombrePagina: 'Saca Tu Turno',
      turnos: [],
      mascotas,
      errores: [{ msg: 'Ya tienes un turno registrado para esta fecha y hora.' }],
      datos: req.body,
    });
  }

  await Turno.create({
    fecha_turno,
    hora,
    cliente,
    motivo,
    mascota_id,
    usuario_id,
    estado : 1
  });

  res.redirect('/turnos');
};


