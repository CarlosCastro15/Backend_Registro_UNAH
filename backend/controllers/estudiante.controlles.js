import {db} from '../db.js'
import jwt from'jsonwebtoken'
import nodemailer from'nodemailer'
import crypto from 'crypto'

export const getEstudiante = (req, res) => {
    const sql = 'SELECT * FROM estudiante';

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
        if (data.length > 0) {
            const id = data[0].num_cuenta;
            const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

            return res.json({ login: true, usuario: data, token: token });

        } else {
            return res.json({ login: false, msg: 'Sin registro' })
        }
    })
}

export const getEstudianteId = (req, res) => {
    const idEstudiante = req.params.num_cuenta;
  
    const sql = 'SELECT * FROM estudiante WHERE num_cuenta = ?';
    db.query(sql, [idEstudiante], (err, results) => {
      if (err) {
        console.error('Error al obtener el estudiante: ' + err);
        res.status(500).json({ error: 'Error al obtener el estudiante' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Estudiante no encontrado' });
        return;
      }
      const estudiante = results[0];
      res.json(estudiante);
    });
  }


export const deleteEstudiante = (req, res) => {
    const adminId = req.params.num_cuenta;

    const sql = `DELETE FROM estudiante WHERE num_cuenta = ${adminId}`;
  
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error al eliminar el estudiante:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el estudiante' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ mensaje: 'No se encontró el estudiante' });
        } else {
          res.json({ mensaje: 'estudiante eliminado exitosamente' });
        }
      }
    })
}

export const updateEstudiante = (req, res) => {
        const adminId = req.params.num_cuenta;
        const adminData = req.body; // Se espera que los datos a actualizar se envíen en el cuerpo de la solicitud
      
        const query = `UPDATE estudiante SET ? WHERE num_cuenta = ${adminId}`;
      
        db.query(query, adminData, (error, results) => {
          if (error) {
            console.error('Error al actualizar el administrador:', error);
            res.status(500).json({ mensaje: 'Error al actualizar el estudiante' });
          } else {
            if (results.affectedRows === 0) {
              res.status(404).json({ mensaje: 'No se encontró el estudiante' });
            } else {
              res.json({ mensaje: 'estudiante actualizado exitosamente' });
            }
          }
          /*{
           if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
            if (data.length > 0) {
                const id = data[0].id;
                const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });
    
                return res.json({ login: true, usuario: data, token: token });
    
            } else {
                return res.json({ login: false, msg: 'Sin registro' })
            }
        }*/
        })
      }

//ENDPOINT PARA ENVIO DE CORREO AL ESTUDIANTE
export const envioCorreoEstudiante = (req, res) => {
  const { email } = req.body;

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

  const resetUrl = `http://localhost:5173/reset-password/${token}?expires=${expiration}&email=${email}`;

  const mailOptions = {
    from: '07castro.carlos@gmail.com',
    to: email,
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


  // Endpoint para restablecer la contraseña estudiante
  export const restaContraEstudiante = (req, res) => {
    const { token, email, password } = req.body;
  
    // Actualizar la contraseña en la base de datos
    const sql = 'UPDATE estudiante SET password_institucional = ? WHERE correo_institucional = ?';
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
