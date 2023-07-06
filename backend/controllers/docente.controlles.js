import {db} from '../db.js'
import jwt from'jsonwebtoken';
import nodemailer from'nodemailer'
import crypto from 'crypto'

//TRAER LAS CARRERAS SEGUN EL CENTRO
export const carrerasCentro = (req, res) => {
const centro = req.params.centro_id;

  // Consulta a la base de datos
  const query = `SELECT * FROM carrera WHERE centro_id = '${centro}'`;

  db.query(query, (err, rows) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      res.status(500).send('Error del servidor');
    } else {
      res.json(rows);
    }
  });
}

//TRAER DOCENTEs SEGUN CARRERA
export const docenteCarreraCentro = (req, res) => {
  const Idcarrera = req.params.carrera;
  const Idcentro = req.params.centro;

  const sql = `SELECT docente.num_empleado, docente.nombres, docente.apellidos, docente.cargo, carrera.nombre, centro.nombre
    FROM docente
    JOIN carrera ON docente.carrera_id = carrera.id
    JOIN centro  ON carrera.centro_id = centro.id
    WHERE carrera.nombre = ? AND centro.id = ? `;

  // Ejecutar la consulta con los parámetros proporcionados
  db.query(sql, [Idcarrera, Idcentro], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });
}



//ACTUALIZAR EL CARGO DEL DOCENTE
export const actualizarCargoDocente = (req, res) => {
  const docenteId = req.params.num_empleado;
  const nuevoRol = req.body.cargo; // asumiendo que se envía el nuevo rol en el cuerpo de la solicitud

  // Construir la consulta SQL para actualizar el rol del docente
  const sql = 'UPDATE docente SET cargo = ? WHERE num_empleado = ?';

  // Ejecutar la consulta en la base de datos
  db.query(sql, [nuevoRol, docenteId], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el rol del docente.' });
    } else {
      res.json({ message: 'El rol del docente ha sido actualizado.' });
    }
  });
};


//ENDPOINT PARA ENVIO DE CORREO AL DOCENTE
export const envioCorreoDocente = (req, res) => {
  const { correo } = req.body;

  // Generar token único con una caducidad de 2 minutos
  const token = crypto.randomBytes(20).toString('hex');
  const expiration = Date.now() + 2 * 60 * 1000; // 2 minutos en milisegundos

  // Aquí deberías almacenar el token y la marca de tiempo de expiración en tu base de datos o sistema de almacenamiento

  // Enviar el enlace de recuperación por correo electrónico
  const transporter = nodemailer.createTransport({
    // Configura tu proveedor de correo electrónico aquí
    service: 'gmail',
    auth: {
      user: '07castro.carlos@gmail.com',
      pass: 'falwoicxephoscez',
    },
  });

  const resetUrl = `http://localhost:5173/docente/reset-password/${token}?expires=${expiration}&email=${correo}`;

  const mailOptions = {
    from: '07castro.carlos@gmail.com',
    to: correo,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al enviar el correo electrónico.' });
    } else {
      console.log('Correo electrónico enviado: ' + info.response);
      res.status(200).json({ message: 'Correo electrónico enviado con éxito.' });
    }
  });
}


// Endpoint para restablecer la contraseña AL DOCENTE
 export const restaContraDocente = (req, res) => {
  const { token, email, password } = req.body;

  // Actualizar la contraseña en la base de datos
  const sql = 'UPDATE docente SET password = ? WHERE correo = ?';
  db.query(sql, [password, email], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Correo electrónico no encontrado.' });
    }

    // Si todo va bien, enviar una respuesta exitosa
    res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
  });
}


export const getDocenteById = (req, res) => {
  const id = req.params.id;

  const sql = `SELECT docente.num_empleado, docente.nombres, docente.apellidos, docente.correo, docente.identidad, docente.cargo, carrera.nombre AS carrera, docente.centro_id FROM docente
  JOIN carrera ON docente.carrera_id = carrera.id
  WHERE docente.num_empleado = ${id}`;

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
    if (data.length > 0) {
      const id = data[0].num_empleado;
      const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

      return res.json(data);

    } else {
      return res.json({ login: false, msg: 'Sin registro' })
    }
  })
}

export const docenteCarreraCentroById = (req, res) => {
  const Idcarrera = req.params.carrera;
  const Idcentro = req.params.centro;


  const sql = `SELECT docente.num_empleado, docente.nombres, docente.apellidos, docente.identidad, docente.correo, docente.cargo, 
              carrera.nombre AS carrera, docente.centro_id AS centro,
              (SELECT nombre FROM centro WHERE id = docente.centro_id) AS nombre_centro
              FROM docente
              JOIN carrera ON docente.carrera_id = carrera.id
              JOIN centro ON carrera.centro_id = centro.id
              WHERE carrera.nombre = ? AND docente.centro_id = ?;`;

  // Ejecutar la consulta con los parámetros proporcionados
  db.query(sql, [Idcarrera, Idcentro], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });
}