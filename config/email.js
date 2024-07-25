import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

const emailConfirmarCuenta = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, url } = datos;

    // Renderiza la plantilla EJS
    const templatePath = path.resolve('views', 'emails', 'confirmar-cuenta.ejs');
    const html = await ejs.renderFile(templatePath, { nombre, url: url });

    // Enviar el correo
    await transport.sendMail({
        from: '"Meeti" <no-reply@meeti.com>',
        to: email,
        subject: 'Confirmar tu cuenta',
        text: `Hola ${nombre}, para verificar tu cuenta haz click en el siguiente enlace: ${url}`,
        html: html
    });
};

export {
    emailConfirmarCuenta
};