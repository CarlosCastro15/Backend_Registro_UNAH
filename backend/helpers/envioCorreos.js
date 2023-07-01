import express from 'express'
import mysql  from 'mysql'
import nodemailer from'nodemailer'
import {db} from '../db.js'

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    //port: 465,
    //secure: true,
    auth: {
      user: '07castro.carlos@gmail.com',
      pass: 'falwoicxephoscez'
    }
  });


// Ruta para enviar el correo
export const enviarCorreosEstudiantes =  (req, res) => {

// Obtener el destinatario y el contenido del correo desde la base de datos
  db.query('SELECT correo_personal, correo_institucional, password_institucional FROM estudiante', (error, results) => {
    if (error) {
      console.error('Error al obtener los correos de la base de datos:', error);
      return res.status(500).json({ error: 'Error al obtener los correos de la base de datos' });
    }
    //const contenido = 'correo instituciona' + correo_institucional + 'contrasena institucional' +password_institucional
    // Enviar un correo a cada destinatario
    results.forEach(row => {
      const { correo_personal, correo_institucional, password_institucional } = row;

      const mailOptions = {
        from: '07castro.carlos@gmail.com',
        to: correo_personal,
        subject: 'Registro UNAH',
        html: '<html><head><meta charset="UTF-8"><title>Mensaje de correo electrónico</title></head><body><div style="max-width: 600px; margin: 0 auto;"><h1>UNIVERSIDAD NACIONAL AUTONOMA DE HONDURAS</h1><p>Estimado/a estudiante el presente correo es para darle de manera oficial su correo y contraseña institucional,</p><p></p><p>Saludos,</p><p>Registro UNAH</p></div></body></html><b><p>Correo institucional:</b></p>' + " " + correo_institucional  + " " + '<p><b>Contraseña institucional:</b></p>' + " " + password_institucional
      };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });
    });

    return res.json({ message: 'Correos enviados correctamente' });
  });
};

