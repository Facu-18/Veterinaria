export function generarHorariosDisponibles(dia) {
    const horarios = [];
    if (dia >= 0 && dia <= 4) { // Lunes a Viernes
        for (let hora = 9; hora < 12; hora++) {
            horarios.push(`${hora}:00`);
            horarios.push(`${hora}:30`);
        }
        for (let hora = 17; hora < 21; hora++) {
            horarios.push(`${hora}:00`);
            horarios.push(`${hora}:30`);
        }
    } else if (dia === 5) { // Sábado
        for (let hora = 9; hora < 12; hora++) {
            horarios.push(`${hora}:00`);
            horarios.push(`${hora}:30`);
        }
    } else if (dia === 1) { // Domingo
        // No agregar horarios
    }
    return horarios;
}
