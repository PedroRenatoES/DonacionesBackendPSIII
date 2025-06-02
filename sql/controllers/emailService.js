// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Cambiar según tu proveedor SMTP
  port: 587,
  secure: false,
  auth: {
    user: 'tu_correo@example.com',
    pass: 'tu_contraseña',
  },
});

async function enviarCorreo({ to, subject, text }) {
  await transporter.sendMail({
    from: '"Tu App" <tu_correo@example.com>',
    to,
    subject,
    text,
  });
}

module.exports = enviarCorreo;
