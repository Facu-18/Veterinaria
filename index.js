import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import passport from './config/passport.js';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import appRoutes from './routes/appRoutes.js'; // Importa tus rutas de la aplicación
import authRoutes from './routes/authRoutes.js'; // Importa tus rutas de autenticación
import db from './config/db.js';
import Categorias from './models/Categoria.js'
import mobbex from "mobbex";
import Especies from './models/Especie.js'

dotenv.config({ path: '.env' });

const app = express();

// Conectar BD
// Conexión a la base de datos
(async () => {
  try {
      await db.authenticate();
      console.log('Conexión establecida correctamente');
      await db.sync(); // Solo llamar a sync una vez en el inicio
       
      // Crear algunas categorías (esto es solo un ejemplo)
      const categorias = [
          { nombre: 'Medicamento' },
          { nombre: 'Alimento' },
          { nombre: 'Ropa' },
          { nombre: 'Acceseorios' },
      ];

      for (const cat of categorias) {
          await Categorias.findOrCreate({ where: { nombre: cat.nombre }, defaults: cat });
      }

      const especies = [
        { nombre: 'Perro' },
        { nombre: 'Gato' },
        { nombre: 'Conejo' },
        { nombre: 'Hámster' },
        { nombre: 'Cobayo / Cuy' },
        { nombre: 'Reptil' },
        { nombre: 'Hurón' },
        { nombre: 'Tortuga' },
        { nombre: 'Aves' }
    ];

    for (const esp of especies) {
        await Especies.findOrCreate({ where: { nombre: esp.nombre }, defaults: esp });
    }
  
  } catch (error) {
      console.error('Error al conectar y sincronizar la base de datos:', error);
  }
})();
// Configuraciones
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Usar express-ejs-layouts

app.set('layout', 'main'); // Establecer layout por defecto
app.use(expressLayouts);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar la sesión
app.use(session({
  secret: process.env.SECRETO,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}));

// Configurar connect-flash
app.use(flash());

// Configurar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Rutas
app.use('/', appRoutes);
app.use('/', authRoutes);

// Iniciar servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo`);
});