import cron from 'node-cron';
import Turno from '../models/Turno.js';
import sequelize from '../config/db.js';

// Configura un job para eliminar turnos pasados todos los días a la medianoche
cron.schedule('0 0 * * *', async () => {
    const hoy = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato 'YYYY-MM-DD'
    
    try {
        // Eliminar todos los turnos cuya fecha sea menor a hoy
        const result = await Turno.destroy({
            where: {
                fecha: {
                    [sequelize.Op.lt]: hoy
                }
            }
        });
        console.log(`Turnos eliminados: ${result}`);
    } catch (error) {
        console.error('Error al eliminar turnos pasados:', error);
    }
});

console.log('Job para limpiar turnos pasados programado.');
