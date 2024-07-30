import multer from "multer";
import Categorias from "../models/Categoria.js";
import Productos from '../models/Productos.js';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import shortid from 'shortid';
import { check, validationResult } from 'express-validator';
import fs from 'fs'

// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de almacenamiento de Multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/imagen-productos'));
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/')[1];
        cb(null, `${shortid.generate()}.${extension}`);
    },
});

// Configuración de Multer
const configuracionMulter = {
    limits: {
        fileSize: 10000000 // Tamaño máximo de archivo 10 MB
    },
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no permitido'), false);
        }
    }
};

// Middleware de Multer para subir una sola imagen
const upload = multer(configuracionMulter).single('imagen');

// Middleware para cargar una sola imagen y luego pasar al siguiente middleware
const subirImagen = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            console.log('Error de carga de archivo:', error.message);
            return res.status(400).render('crear-producto', {
                nombrePagina: 'Crear Producto',
                categorias: [], // Aquí podrías querer pasar las categorías de alguna manera
                errores: [{ msg: 'Error al subir la imagen: ' + error.message }],
                datos: req.body
            });
        }
        next(); // Pasar al siguiente middleware si la carga es exitosa
    });
};

// Formulario para crear producto
const crearProducto = async (req, res) => {
    // Consultar modelo de Categorías
    const categorias = await Categorias.findAll();
  
    res.render('crear-producto', {
        nombrePagina: 'Crear Producto',
        categorias,
        datos: {},
        errores: []
    });
};

// Middleware para crear un producto
const guardar = async (req, res) => {
    // Validación
    await check('nombre').notEmpty().trim().escape().withMessage('El campo nombre es obligatorio').run(req);
    await check('descripcion').notEmpty().trim().escape().withMessage('La descripción no puede estar vacía').run(req);
    await check('precio').notEmpty().trim().escape().withMessage('El precio no puede estar vacío').run(req);
    await check('categoria').notEmpty().trim().escape().withMessage('Selecciona una categoría').run(req);
    
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Consultar modelo de Categorías
        const categorias = await Categorias.findAll();

        return res.render('crear-producto', {
            nombrePagina: 'Crear Producto',
            categorias,
            errores: resultado.array(),
            datos: req.body
        });
    }

    // Validar si la imagen ha sido cargada
    if (!req.file) {
        // Asegúrate de manejar el caso en el que la imagen no está presente
        return res.render('crear-producto', {
            nombrePagina: 'Crear Producto',
            categorias: await Categorias.findAll(),
            errores: [{ msg: 'Debes subir una imagen' }],
            datos: req.body
        });
    }

    const { nombre, descripcion, precio, categoria: categoriaId } = req.body;
    const imagen = req.file.filename; // Usar la imagen subida por Multer

    try {
        await Productos.create({
            nombre,
            descripcion,
            categoriaId,
            precio,
            imagen,
            usuarioId: req.usuario.id
        });

        // Redirigir a la página deseada o mostrar un mensaje de éxito
        res.redirect('/administracion'); // Cambia '/productos' por la ruta deseada
    } catch (error) {
        console.log(error);
        const categorias = await Categorias.findAll();

        res.render('crear-producto', {
            nombrePagina: 'Crear Producto',
            categorias,
            errores: [{ msg: 'Error al guardar el producto. Inténtalo de nuevo.' }],
            datos: req.body
        });
    }
};

const editarProducto = async (req, res) => {
    // Consultar modelo de Categorías
    const categorias = await Categorias.findAll();
    
    const { id } = req.params;

    const producto = await Productos.findByPk(id);

    res.render('editar-producto', {
        nombrePagina: `Editar Producto ${producto.nombre}`,
        categorias,
        datos: producto,
        errores: []
    });
};

// Middleware para editar un producto
const guardarCambios = async (req, res) => {
    const { id } = req.params;
    const producto = await Productos.findByPk(id);

    // Validación
    await check('nombre').notEmpty().trim().escape().withMessage('El campo nombre es obligatorio').run(req);
    await check('descripcion').notEmpty().trim().escape().withMessage('La descripción no puede estar vacía').run(req);
    await check('precio').notEmpty().trim().escape().withMessage('El precio no puede estar vacío').run(req);
    await check('categoria').notEmpty().trim().escape().withMessage('Selecciona una categoría').run(req);
    
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Consultar modelo de Categorías
        const categorias = await Categorias.findAll();

        return res.render('editar-producto', {
            nombrePagina: `Editar Producto ${producto.nombre}`,
            categorias,
            errores: resultado.array(),
            datos: req.body
        });
    }

    // Validar si la imagen ha sido cargada
    if (!req.file) {
        return res.render('editar-producto', {
            nombrePagina: `Editar Producto ${producto.nombre}`,
            categorias: await Categorias.findAll(),
            errores: [{ msg: 'Debes subir una imagen' }],
            datos: req.body
        });
    }

    // Validar que el producto exista
    if (!producto) {
        return res.redirect('/administracion');
    }

    // Revisar quién visita la URL es el dueño del producto
    if (producto.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/administracion');
    }

    const { nombre, descripcion, precio, categoria: categoriaId } = req.body;
    const imagen = req.file.filename; // Usar la imagen subida por Multer

    try {
        await Productos.update({
            nombre,
            descripcion,
            categoriaId,
            precio,
            imagen,
            usuarioId: req.usuario.id
        }, {
            where: {
                id
            }
        });

        // Redirigir a la página deseada o mostrar un mensaje de éxito
        res.redirect('/administracion'); // Cambia '/productos' por la ruta deseada
    } catch (error) {
        console.log(error);
        const categorias = await Categorias.findAll();

        res.render('editar-producto', {
            nombrePagina: `Editar Producto ${producto.nombre}`,
            categorias,
            errores: [{ msg: 'Error al guardar el producto. Inténtalo de nuevo.' }],
            datos: req.body
        });
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;

    // Validar que el producto exista
    const producto = await Productos.findByPk(id);

    if (!producto) {
        return res.redirect('/administracion');
    }

    // Revisar quién visita la URL es el dueño del producto
    if (producto.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/administracion');
    }

    // Eliminar la imagen
    const rutaImagen = path.join(__dirname, '../public/uploads/imagen-productos', producto.imagen);

    fs.unlink(rutaImagen, (error) => {
        if (error) {
            console.error('Error al eliminar la imagen:', error);
        }
    });

    // Eliminar el producto
    await producto.destroy();
    res.redirect('/administracion');
};

const mostrarProductos = async (req, res) => {
    const { pagina: paginaActual } = req.query;

    const expresion = /^[1-9]$/;

    if (!expresion.test(paginaActual)) {
        return res.redirect('/productos?pagina=1');
    }

    try {
        const limit = 6;
        const offset = (paginaActual * limit) - limit;

        const [productos, total] = await Promise.all([
            Productos.findAll({
                limit,
                offset,
                include: [
                    { model: Categorias, as: 'categoria' },
                ],
            }),
            Productos.count()
        ]);

        console.log('Productos:', JSON.stringify(productos, null, 2)); // Verifica los datos
        console.log('Total:', total); // Verifica el total

        res.render('productos', {
            nombrePagina: 'Productos',
            productos,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        });

    } catch (error) {
        console.log(error);
        res.status(500).render('error', {
            nombrePagina: 'Error',
            mensaje: 'Error interno del servidor'
        });
    }
};

const verProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Productos.findOne({
            where: { id },
            include: [{ model: Categorias, as: 'categoria' }]
        });

        if (!producto) {
            return res.status(404).render('error', {
                nombrePagina: 'Producto no encontrado',
                mensaje: 'El producto no existe'
            });
        }

        res.render('ver-producto', {
            nombrePagina: `Producto - ${producto.nombre}`,
            producto
        });

    } catch (error) {
        console.log(error);
        res.status(500).render('error', {
            nombrePagina: 'Error',
            mensaje: 'Error interno del servidor'
        });
    }
};



export {
    subirImagen,
    crearProducto,
    guardar,
    mostrarProductos,
    verProducto,
    guardarCambios,
    editarProducto,
    eliminar
};

