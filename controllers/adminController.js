import  Productos from '../models/Productos.js'
import Categoria from '../models/Categoria.js';


const admin = async (req, res) => {
    const { pagina: paginaActual } = req.query;

    const expresion = /^[1-9]$/;

    if (!expresion.test(paginaActual)) {
        return res.redirect('/administracion?pagina=1');
    }

    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).render('error', {
                nombrePagina: 'Error',
                mensaje: 'No autorizado o sesión expirada'
            });
        }

        const { id } = req.usuario;

        const limit = 5;
        const offset = (paginaActual * limit) - limit;

        const [productos, total] = await Promise.all([
            Productos.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                ],
            }),
            Productos.count({
                where: {
                    usuarioId: id
                }
            })
        ]);

        console.log('Productos:', JSON.stringify(productos, null, 2)); // Verifica los datos
        console.log('Total:', total); // Verifica el total

        res.render('administracion', {
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

export{
    admin
}