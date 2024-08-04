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
        from: '"Veteliceo" <no-reply@meeti.com>',
        to: email,
        subject: 'Confirmar tu cuenta',
        text: `Hola ${nombre}, para verificar tu cuenta haz click en el siguiente enlace: ${url}`,
        html: html
    });
};

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos

    // Enviar el mail
    await transport.sendMail({
        from: '"Veteliceo" <no-reply@meeti.com>',
        to: email,
        subject: 'Reestablece tu contraseña en VeteLiceo.com',
        text:'Reestablece tu contraseña en VeteLiceo.com',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p style="font-size: 16px;">Hola ${nombre},</p>
                <p style="font-size: 16px;">Has solicitado reestablecer tu contraseña en VeteLiceo</p>
                <p style="font-size: 16px;">Sigue el siguiente enlace para generar una nueva contraseña:</p>
                <p><a href="http://localhost:${process.env.PORT}/olvide-password/${token}" style="background-color: #4a90e2; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reestablecer Contraseña</a></p>
                <p style="font-size: 16px;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            </div>
        `
    })
}

const enviarEmailConfirmacionPago = async (datos) => {
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    const { email, nombre, total, productos } = datos;
  
    const listaProductos = productos.map(producto => 
      `<li>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: ${producto.precio}</li>`
    ).join('');
  
    // Enviar el mail
    await transport.sendMail({
      from: '"Veteliceo" <no-reply@veteliceo.com>',
      to: email,
      subject: 'Confirmación de Pago en Veteliceo',
      text: 'Confirmación de Pago en Veteliceo',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p style="font-size: 16px;">Hola ${nombre},</p>
          <p style="font-size: 16px;">Gracias por tu compra en Veteliceo.</p>
          <p style="font-size: 16px;">Detalles de tu compra:</p>
          <ul>
            ${listaProductos}
          </ul>
          <p style="font-size: 16px;">Total: ${total}</p>
          <p style="font-size: 16px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
      `
    });
  };

export {
    emailConfirmarCuenta,
    emailOlvidePassword,
    enviarEmailConfirmacionPago
};