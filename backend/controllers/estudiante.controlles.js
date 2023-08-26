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
  
    const sql = 'SELECT e.*, c.nombre AS nombre_carrera, ce.nombre AS nombre_centro FROM estudiante e JOIN carrera c ON e.carrera_id = c.id JOIN centro ce ON e.centro_id = ce.id WHERE e.num_cuenta = ?';
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

  export const actualizarEstuDescri = (req, res) => {
    const numCuenta = req.params.num_cuenta;
    const nuevaDescripcion = req.body.descripcion;
  
    const sql = 'UPDATE estudiante SET descripcion = ? WHERE num_cuenta = ?';
    db.query(sql, [nuevaDescripcion, numCuenta], (error, results) => {
      if (error) {
        console.error('Error al actualizar la descripción:', error);
        res.status(500).send('Error al actualizar la descripción del estudiante');
      } else {
        res.send('Descripción del estudiante actualizada correctamente');
      }
    });
  }


  //listar los alumnos segun el id de la clase //acordate
  export const clasesAlumno = (req, res) => {
    const id_clase = req.params.id_clase;
  
    const query = `
      SELECT cp.nota, e.num_cuenta, e.primer_nombre, e.primer_apellido, e.correo_institucional
      FROM clase_pasada cp
      JOIN estudiante e ON cp.id_estudiante = e.num_cuenta
      WHERE cp.id_clase = ?`;
  
      db.query(query, [id_clase], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  };

  // Endpoint para realizar la consulta listar los alumnos segun el id de la clase //acordate
/*export const claseAlumnoidseccion = (req, res) => {
  const id_seccion = req.params.id_seccion;
  
  // Consulta SQL
  const sql = `
    SELECT m.*, e.num_cuenta, e.primer_nombre, e.primer_apellido, e.correo_institucional, m.id_seccion, c.id_clase
    FROM matricula m
    INNER JOIN estudiante e ON m.num_cuenta = e.num_cuenta
    INNER JOIN seccion s ON m.id_seccion = s.id_seccion
    INNER JOIN clase c ON s.id_clase = c.id_clase
    WHERE m.id_seccion = ?
  `;

  db.query(sql, [id_seccion], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }

    res.json(results);
  });
};*/

//insertar en la tabla clases pasada luego de haber cambiado la nota del estudiante //acordate
export const insertarclasepasada = (req, res) => {
  const { id_clase, id_estudiante, nota } = req.body;

  const consulta = `
    INSERT INTO clase_pasada (id_clase, id_estudiante, nota)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE nota = VALUES(nota)
  `;

  db.query(consulta, [id_clase, id_estudiante, nota], (err, resultados) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err.message);
      res.status(500).send('Error al ejecutar la consulta');
    } else {
      // Inserción exitosa o actualización realizada correctamente
      const queryActualizarIndice = `
      UPDATE estudiante AS e
      SET e.indice = ROUND(
        (SELECT AVG(CAST(nota AS DECIMAL(5, 2)))
         FROM clase_pasada
         WHERE id_estudiante = e.num_cuenta),
        0
      )
      WHERE e.num_cuenta = ?
      `;

      db.query(queryActualizarIndice, [id_estudiante], (err, resultadosIndice) => {
        if (err) {
          console.error('Error al actualizar el índice del estudiante:', err.message);
        } else {
          console.log('Índice del estudiante actualizado exitosamente');
        }
      });

      res.status(200).send('Inserción exitosa o actualización realizada correctamente');
    }
  });
};


  //editar nota del estudiante 
  export const notaEstudiante = (req, res) => {
    const idClase = req.params.id_clase;
    const idEstudiante = req.params.id_estudiante;
    const nuevaNota = req.body.nota;
  
    const sql = `UPDATE clase_pasada SET nota = ? WHERE id_clase = ? AND id_estudiante = ?`;
  
    db.query(sql, [nuevaNota, idClase, idEstudiante], (err, result) => {
      if (err) {
        console.error('Error al actualizar la nota: ', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
  
      res.status(200).send('Nota actualizada exitosamente');
    });
  };


  //-------------
//OBTENER CLASESFALTANTES POR MEDIO DEL ID DEL ESTUDIANTE

export const clasesByIdEstudiante = (req, res) => {
  const num_cuenta = req.params.num_cuenta;

  const sql = `SELECT cs.*, c.nombre AS nombre_clase, ca.nombre AS nombre_carrera, s.*, a.horainicio, a.horafin, d.nombres, d.apellidos
    FROM c_ing_sistemas cs
    JOIN clase c ON cs.IdClase = c.id_clase
    JOIN carrera ca ON c.id_carrera = ca.id
    JOIN seccion s ON s.id_clase = cs.IdClase
    JOIN aula a ON s.id_aula = a.id_aula
    JOIN docente d ON s.num_empleado = d.num_empleado
    WHERE cs.IdClase NOT IN (
      SELECT id_clase
      FROM clase_pasada
      WHERE id_estudiante = ? AND nota >= '65'
    )`;
  db.query(sql, [num_cuenta], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });

}

export const verificarRequisito = (req, res) => {
  const idClase = req.params.idClase;

  // Consultar los requisitos de la clase solicitada
  const query = `SELECT Requisito1, Requisito2 FROM c_ing_sistemas WHERE IdClase = ${idClase}`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al consultar los requisitos de la clase: ', err);
      res.status(500).json({ error: 'Ocurrió un error al verificar los requisitos de la clase' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'La clase especificada no existe' });
      return;
    }

    const requisito1 = result[0].Requisito1;
    const requisito2 = result[0].Requisito2;

    // Consultar si el estudiante ha aprobado los requisitos
    const estudianteId = 20231021; // ID del estudiante (debe obtenerse de alguna manera)

    let requisitosQuery = '';

    if (requisito1) {
      requisitosQuery += `
        SELECT COUNT(*) AS count
        FROM clase_pasada
        WHERE id_clase = ${requisito1}
          AND id_estudiante = ${estudianteId}
          AND nota >= 65
      `;
    }

    if (requisito2) {
      if (requisitoQuery) {
        requisitosQuery += ' UNION ';
      }

      requisitosQuery += `
        SELECT COUNT(*)
        FROM clase_pasada
        WHERE id_clase = ${requisito2}
          AND id_estudiante = ${estudianteId}
          AND nota >= 65
      `;
    }

    if (!requisito1 && !requisito2) {
      // La clase no tiene requisitos
      res.json({ resultado: 'El estudiante cumple con los requisitos para la clase solicitada' });
      // res.json({ resultado: 'La clase no tiene requisitos' });

      return;
    }

    db.query(requisitosQuery, (err, result) => {
      if (err) {
        console.error('Error al verificar los requisitos del estudiante: ', err);
        res.status(500).json({ error: 'Ocurrió un error al verificar los requisitos del estudiante' });
        return;
      }

      const count = result.reduce((total, row) => total + row.count, 0);

      if (count === result.length) {
        res.json({ resultado: 'El estudiante cumple con los requisitos para la clase solicitada' });
      } else {
        res.json({ resultado: 'El estudiante no cumple con los requisitos para la clase solicitada' });
      }
    });
  });
}

export const verificarHorario = (req, res) => {
  const idSeccion = req.params.idSeccion;
  const num_cuenta = req.params.num_cuenta;
  const anio = req.params.anio;
  const periodo = req.params.periodo;
  //id del estudiante
  //anio y periodo del proceso matricula disponibilidad = 1

  // Obtener la información de la sección seleccionada y su aula correspondiente
  const query = `
    SELECT s.id_seccion, a.id_aula, a.horainicio, a.horafin
    FROM seccion s
    INNER JOIN aula a ON s.id_aula = a.id_aula
    WHERE s.id_seccion = ${idSeccion}
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al consultar la información de la sección: ', err);
      res.status(500).json({ error: 'Ocurrió un error al verificar la matrícula' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'La sección especificada no existe' });
      return;
    }

    const idAula = result[0].id_aula;
    const horainicio = result[0].horainicio;
    const horafin = result[0].horafin;

    // Verificar si el estudiante está matriculado en otra clase a la misma hora
    const estudianteId = 20231021; // ID del estudiante (debe obtenerse de alguna manera)

    // const matriculaQuery = `
    //   SELECT COUNT(*) AS count
    //   FROM matricula m
    //   INNER JOIN seccion s ON m.id_seccion = s.id_seccion
    //   INNER JOIN aula a ON s.id_aula = a.id_aula
    //   WHERE m.num_cuenta = ${estudianteId}
    //     AND a.horainicio = '${horainicio}'
    //     AND a.horafin = '${horafin}'
    // `;

//     const matriculaQuery = `
//   SELECT COUNT(*) AS count
//   FROM matricula m
//   INNER JOIN seccion s ON m.id_seccion = s.id_seccion
//   INNER JOIN aula a ON s.id_aula = a.id_aula
//   WHERE m.num_cuenta = ${estudianteId}
//     AND a.horainicio = '${horainicio}'
//     AND a.horafin = '${horafin}'
//     AND EXISTS (
//       SELECT 1
//       FROM proceso p
//       WHERE p.anio = '${anio}'
//         AND p.periodo = '${periodo}'
//     )
// `;

const matriculaQuery = `
  SELECT COUNT(*) AS count
  FROM matricula m
  INNER JOIN seccion s ON m.id_seccion = s.id_seccion
  INNER JOIN aula a ON s.id_aula = a.id_aula
  INNER JOIN proceso p ON s.anio = p.anio AND s.periodo = p.periodo
  WHERE m.num_cuenta = ${num_cuenta}
    AND a.horainicio = '${horainicio}'
    AND a.horafin = '${horafin}'
    AND p.anio = '${anio}'
    AND p.periodo = '${periodo}'
`;

    db.query(matriculaQuery, (err, result) => {
      if (err) {
        console.error('Error al verificar la matrícula del estudiante: ', err);
        res.status(500).json({ error: 'Ocurrió un error al verificar la matrícula del estudiante' });
        return;
      }

      const count = result[0].count;

      if (count > 0) {
        res.json({ resultado: 'El estudiante ya está matriculado en otra clase a la misma hora' });
      } else {
        res.json({ resultado: 'El estudiante no tiene otra clase matriculada a la misma hora' });
      }
    });
  });
};


export const matriculaSeccion = (req, res) => {
  const numCuenta = req.body.num_cuenta;
  const idSeccion = req.body.idSeccion;


  const sql = 'INSERT INTO matricula (num_cuenta, id_seccion) VALUES (?,?)';
  db.query(sql, [numCuenta, idSeccion], (error, results) => {
    if (error) {
      console.error('Error al ingresar los datos:', error);
      res.status(500).json({ error: 'Error al ingresar los datos' });
    } else {
      res.json({ message: 'Datos ingresados correctamente' });
    }
  });
}

export const eliminarClase = (req, res) => {
  const num_cuenta = req.params.num_cuenta;
  const id_seccion = req.params.id_seccion;

  const deleteQuery = 'DELETE FROM matricula WHERE num_cuenta = ? AND id_seccion = ?';

  db.query(deleteQuery, [num_cuenta, id_seccion], (err, result) => {
    if (err) {
      console.error('Error al ejecutar el DELETE:', err);
      res.status(500).json({ error: 'Error al eliminar el item de la tabla' });
      return;
    }

    res.json({ message: 'Item eliminado correctamente de la tabla matricula' });
  });
};

export const clases_matriculadas = (req, res) => {
  const numCuenta = req.params.num_cuenta;
  const anio = req.params.anio;
  const periodo = req.params.periodo;

  const sqlQuery = `
    SELECT *
    FROM seccion s
    INNER JOIN clase c ON s.id_clase = c.id_clase
    INNER JOIN aula a ON s.id_aula = a.id_aula
    WHERE s.id_seccion IN (
      SELECT id_seccion
      FROM matricula m
      WHERE m.num_cuenta = ?
    )
    AND EXISTS (
      SELECT 1
      FROM proceso p
      WHERE p.anio = ?
      AND p.periodo = ?
    )
  `;

  db.query(sqlQuery, [numCuenta, anio, periodo], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
    } else {
      res.json(results);
    }
  });
};


export const estudianteSeccionObtener = (req, res) => {
  const idSeccion = req.params.idSeccion;

  const sqlQuery = `
    SELECT 
        estudiante.primer_nombre,
        estudiante.segundo_nombre,
        estudiante.primer_apellido,
        estudiante.segundo_apellido,
        estudiante.num_cuenta,
        estudiante.correo_institucional,
        COALESCE(clase_pasada.nota, 0) AS nota,
        CONCAT('http://localhost:8081/', imagen.nombre_archivo) AS nombre_archivo_completo
    FROM
        matricula
    INNER JOIN
        estudiante ON matricula.num_cuenta = estudiante.num_cuenta
    LEFT JOIN
        seccion ON matricula.id_seccion = seccion.id_seccion
    LEFT JOIN
        clase_pasada ON estudiante.num_cuenta = clase_pasada.id_estudiante AND seccion.id_clase = clase_pasada.id_clase
    LEFT JOIN
        imagen ON estudiante.num_cuenta = imagen.id_estudiante
    WHERE
        seccion.id_seccion = ?;
  `;

  db.query(sqlQuery, [idSeccion], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
    } else {
      res.json(results);
    }
  });
};
//Historial
export const clases_historial = (req, res) => {
  const numCuenta = req.params.num_cuenta;
 

  const sqlQuery = `
  SELECT cp.id, cp.nota,  c.codigo, c.nombre AS nombre, s.periodo,year(s.anio) as anio
    FROM clase_pasada cp
    JOIN clase c ON cp.id_clase = c.id_clase
    JOIN seccion s ON c.id_clase = s.id_clase
    WHERE cp.id_estudiante= ?
  `;

  db.query(sqlQuery, [numCuenta], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
    } else {
      res.json(results);
    }
  });
};


// Ruta para enviar correos
export const enviarCorreoNumCuenta = (req, res) => {
  const numCuentaParam = req.params.numCuenta;

  // Consulta SQL para obtener información del estudiante
  const selectQuery = `SELECT * FROM estudiante WHERE num_cuenta = ${numCuentaParam}`;

  // Ejecutar la consulta
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error al consultar la base de datos');
      return;
    }

    // Verificar si se encontraron resultados
    if (results.length === 0) {
      res.status(404).send('No se encontró ningún estudiante con ese número de cuenta.');
      return;
    }

    const student = results[0]; // Tomar el primer resultado (debería ser único por el número de cuenta)

    // Configuración de nodemailer para enviar correos
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Cambiar al proveedor de correo que quieras usar
      auth: {
        user: '07castro.carlos@gmail.com',
        pass: 'falwoicxephoscez'
      }
    });

    
    const mailOptions = {
      from: '07castro.carlos@gmail.com',
      to: student.correo_institucional,
      subject: 'Docente UNAH',
      html: `<html><head><meta charset="UTF-8"><title>Mensaje de correo electrónico</title></head><body><div style="max-width: 600px; margin: 0 auto;"><h1>UNIVERSIDAD NACIONAL AUTONOMA DE HONDURAS</h1><p>Estimado/a estudiante el presente correo es para informale que ya se respondio su solicitud enviada al coordinador de la carrera favor revisar el estado de la solicitud, este es un mensaje generado automaticamente, favor no responderlo\</p><p></p><p>Saludos,</p><p>Coordinacion Ingenieria</p></div></body></html>`
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
      } else {
        console.log('Correo enviado:', info.response);
        res.send('Correo enviado exitosamente');
      }
    });
  });
};



//aqui modifico angel
export const traerDeptosByIdCarrera = (req, res) => {

  //Aqui sera necesario hacer el ciclo if para ver de que carrera es
  const query = `
      SELECT DISTINCT c.id AS id_carrera, c.nombre AS nombre_carrera
      FROM clase AS cl
      JOIN c_ing_sistemas AS c_ing ON cl.id_clase = c_ing.IdClase
      JOIN carrera AS c ON cl.id_carrera = c.id;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
        return;
      }
  
      res.json(results);
    });
}


