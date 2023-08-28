
import { db } from '../db.js'
import nodemailer from 'nodemailer'


export const crearSeccion = (req, res) => {
  const sql = "INSERT INTO seccion (id_clase, num_empleado, id_aula, dias, cupos, id_edificio, anio, periodo) VALUES (?,?,?,?,?,?,?,?)";
  const {id_clase, num_empleado, id_aula, dias, cupos, id_edificio, anio, periodo} = req.body;

  const values = [id_clase, num_empleado, id_aula, dias, cupos, id_edificio, anio, periodo];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
  const query = 'UPDATE aula SET disponibilidad = 0 WHERE id_aula = ?';

  db.query(query, [id_aula], (err, results) => {
    if (err) {
      console.error('Error al actualizar la disponibilidad: ', err);
      return;
    }
    console.log('Disponibilidad actualizada correctamente');
    console.log(results);
  });
};
  
  // AÑADIDOS
  
  export const eliminarSeccion = (req, res) => {
    const id = req.params.id;

    // Consulta SQL para eliminar los registros en la tabla "matricula" que hacen referencia a la sección que será eliminada
    const deleteMatriculaQuery = `DELETE FROM matricula WHERE id_seccion = ${id}`;

    // Consulta SQL para eliminar los registros en la tabla "evaluardocente" que hacen referencia a la sección que será eliminada
    const deleteEvaluarDocenteQuery = `DELETE FROM evaluardocente WHERE id_seccion = ${id}`;

    // Consulta SQL para eliminar la tabla "seccion" una vez que los registros relacionados en "matricula" y "evaluardocente" hayan sido eliminados
    const deleteSeccionQuery = `DELETE FROM seccion WHERE id_seccion = ${id}`;

    // Ejecutar la consulta SQL para eliminar los registros relacionados en "matricula"
    db.query(deleteMatriculaQuery, (error, matriculaResults) => {
        if (error) {
            console.error('Error al eliminar registros relacionados en "matricula":', error);
            res.status(500).json({ error: 'Error al eliminar registros relacionados en "matricula"' });
        } else {
            // Ahora que los registros en "matricula" han sido eliminados, procedemos a eliminar los registros en "evaluardocente"
            db.query(deleteEvaluarDocenteQuery, (error, evaluarDocenteResults) => {
                if (error) {
                    console.error('Error al eliminar registros relacionados en "evaluardocente":', error);
                    res.status(500).json({ error: 'Error al eliminar registros relacionados en "evaluardocente"' });
                } else {
                    // Ahora que los registros en "evaluardocente" han sido eliminados, procedemos a eliminar la sección
                    db.query(deleteSeccionQuery, (error, seccionResults) => {
                        if (error) {
                            console.error('Error al eliminar la tabla "seccion":', error);
                            res.status(500).json({ error: 'Error al eliminar la tabla "seccion"' });
                        } else {
                            res.json({ message: 'Seccion eliminada correctamente' });
                        }
                    });
                }
            });
        }
    });
};

  
  export const seccionporId = (req, res) => {
    const idClase = req.params.id_clase;
    const idDocente = req.params.num_empleado;
    
  
    const sql = 'SELECT * FROM seccion WHERE id_clase = ? AND num_empleado = ?';
    db.query(sql, [idClase,idDocente], (err, results) => {
      if (err) {
        console.error('Error al obtener el Seccion: ' + err);
        res.status(500).json({ error: 'Error al obtener el Seccion' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Seccion no encontrado' });
        return;
      }
      const estudiante = results[0];
      res.json(estudiante);
    });
  }
  
  export const actualizarCuposSeccion = (req, res) => {
    const idSeccion = req.params.id_seccion;
    const nuevoCupos = req.body.cupos;
  
    const sql = 'UPDATE seccion SET cupos = ? WHERE id_seccion = ?';
    db.query(sql, [idSeccion, nuevoCupos], (error, results) => {
      if (error) {
        console.error('Error al actualizar los cupos:', error);
        res.status(500).send('Error al actualizar los cupos de la seccion');
      } else {
        res.send('Se actualizaron los cupos correctamente');
      }
    });
  }

  export const seccionesclases = (req, res) => {
    const { carreraId, periodo,anio } = req.params;
  

  const query = `
  SELECT s.*, c.codigo AS codigo_asignatura, c.nombre AS nombre_clase, 
  CONCAT(d.nombres, ' ', d.apellidos) AS nombre_docente,
  e.nombre AS nombre_edificio, a.num_aula
FROM seccion s
JOIN clase c ON s.id_clase = c.id_clase
JOIN carrera ca ON c.id_carrera = ca.id
JOIN aula a ON s.id_aula = a.id_aula
JOIN edificio e ON a.id_edificio = e.id_edificio
JOIN centro ce ON e.id_edificio = ce.id
JOIN docente d ON s.num_empleado = d.num_empleado
WHERE ca.id = ?
AND s.periodo = ?
AND YEAR(s.anio) = ?;
  `;

  db.query(query, [carreraId,periodo, anio], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error al obtener las secciones' });
      return;
    }

    res.json(results);
  });
  };

  //ENVIAR CORREOS ELECTRONICOS A LOS ALUMNOS PARA AVISAR QUE YA SE SUBIO SU NOTA ESTO DEACUERDO AL id_seccion
  export const enviarcorreosnotificacion = (req, res) => {
    const id_seccion = req.params.id_seccion;
  
    // Función para obtener los correos electrónicos de los estudiantes según id_seccion
    function obtenerCorreosEstudiantesPorSeccion(id_seccion, callback) {
      const query = `
        SELECT correo_institucional FROM estudiante
        JOIN matricula ON estudiante.num_cuenta = matricula.num_cuenta
        WHERE matricula.id_seccion = ?;
      `;
  
      db.query(query, [id_seccion], (error, results) => {
        if (error) {
          console.error('Error al obtener los correos electrónicos de los estudiantes:', error);
          callback(error, null);
        } else {
          const correos = results.map((result) => result.correo_institucional);
          callback(null, correos);
        }
      });
    }
  
    function enviarCorreosEstudiantes(id_seccion, correos) {
      // Crear un transporter de Nodemailer
      const transporter = nodemailer.createTransport({
        // Reemplaza con la configuración de tu proveedor de servicios de correo electrónico
        service: 'gmail',
        auth: {
          user: '07castro.carlos@gmail.com',
          pass: 'falwoicxephoscez',
        },
      });
    
      // Opciones del correo electrónico
      const opcionesCorreo = {
        from: '07castro.carlos@gmail.com',
        to: correos.join(','),
        subject: 'Subida de Notas',
        html: `<html><head><meta charset="UTF-8"><title>Mensaje de correo electrónico</title></head><body><div style="max-width: 600px; margin: 0 auto;"><h1>UNIVERSIDAD NACIONAL AUTONOMA DE HONDURAS</h1><p>Este correo es para informarle que ya se le ha registrado su nota de la clase en la sección ${id_seccion}</p><p>Saludos,</p><p>Registro UNAH</p></div></body></html>`,
      };
    
      // Enviar el correo electrónico
      transporter.sendMail(opcionesCorreo, (error, info) => {
        if (error) {
          console.error('Error al enviar los correos electrónicos:', error);
          res.status(500).json({ error: 'Error al enviar los correos electrónicos' });
        } else {
          console.log('Correos electrónicos enviados:', info.response);
          res.status(200).json({ message: 'Correos electrónicos enviados correctamente' });
        }
      });
    }
    
  
    // Obtener los correos electrónicos de los estudiantes según id_seccion y enviar correos
    obtenerCorreosEstudiantesPorSeccion(id_seccion, (err, correos) => {
      if (err) {
        console.error('Error al obtener los correos electrónicos de los estudiantes:', err);
        res.status(500).json({ error: 'Error al obtener los correos electrónicos de los estudiantes' });
        return;
      }
    
      if (correos.length > 0) {
        enviarCorreosEstudiantes(id_seccion, correos); // Pasa el id_seccion a la función
      } else {
        res.status(404).json({ message: 'No se encontraron estudiantes para la id_seccion especificada' });
      }
    });
  }

    //AÑADIDO
    export const clasesByIdCarrera = (req, res) => {
      const id_carrera = req.params.id_carrera;
    
      // Consulta SQL para obtener todas las clases de la carrera específica
      const sqlQuery = `SELECT * FROM clase WHERE id_carrera = ?`;
    
      db.query(sqlQuery, [id_carrera], (err, results) => {
        if (err) {
          console.error('Error al obtener las clases:', err);
          res.status(500).json({ error: 'Error al obtener las clases' });
        } else {
          res.json(results);
        }
      });
    };
  
    export const seccionesByIdClase = (req, res) => {
      const id_clase = req.params.id_clase;
    
      // Consulta SQL para obtener todas las secciones de la clase específica
      const sqlQuery = `SELECT 
      s.id_seccion,
      d.nombres,
      d.apellidos,
      e.nombre AS nombre_edificio,
      a.*,
      s.cupos AS numero_cupos,
      COUNT(DISTINCT m.num_cuenta) AS numero_estudiantes_matriculados,
      COUNT(DISTINCT le.num_cuenta) AS numero_estudiantes_lista_espera
  FROM 
      seccion s
  INNER JOIN 
      docente d ON s.num_empleado = d.num_empleado
  INNER JOIN 
      edificio e ON s.id_edificio = e.id_edificio
  INNER JOIN 
      aula a ON s.id_aula = a.id_aula
  LEFT JOIN 
      matricula m ON s.id_seccion = m.id_seccion
  LEFT JOIN
      lista_espera le ON s.id_seccion = le.id_seccion
  WHERE 
      s.id_clase = ?
  GROUP BY 
      s.id_seccion,
      d.nombres,
      d.apellidos,
      e.nombre,
      a.id_aula,
      s.cupos;`
  ;
    
      db.query(sqlQuery, [id_clase], (err, results) => {
        if (err) {
          console.error('Error al obtener las secciones:', err);
          res.status(500).json({ error: 'Error al obtener las secciones' });
        } else {
          res.json(results);
        }
      });
    };


    // Endpoint para actualizar la cantidad de cupos en la sección
export const seccionActualizarCupos = (req, res) => {
  const idSeccion = req.params.id_seccion;
  const nuevosCupos = req.body.cupos;

  const sql = 'UPDATE seccion SET cupos = ? WHERE id_seccion = ?';

  db.query(sql, [nuevosCupos, idSeccion], (err, result) => {
    if (err) {
      console.error('Error al actualizar los cupos:', err);
      res.status(500).json({ error: 'Error al actualizar los cupos' });
    } else {
      res.json({ message: 'Cupos actualizados exitosamente' });
    }
  });
};

// Define el endpoint para insertar datos en la tabla 'seccion'

//  export const insertarSeccion = (req, res) => {
//   const {
//     id_clase,
//     anio,
//     periodo,
//     num_empleado,
//     id_aula,
//     dias,
//     cupos,
//     id_edificio,
//     horainicio,
//     horafin,
//     unidades_valo
//   } = req.body;

//   const query = `
//     INSERT INTO seccion
//     (id_clase, anio, periodo, num_empleado, id_aula, dias, cupos, id_edificio, horainicio, horafin)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     id_clase,
//     anio,
//     periodo,
//     num_empleado,
//     id_aula,
//     dias,
//     cupos,
//     id_edificio,
//     horainicio,
//     horafin
//   ];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Error al insertar datos:', err);
//       res.status(500).json({ error: 'Error al insertar datos en la tabla seccion' });
//     } else {
//       res.status(201).json({ message: 'Datos insertados correctamente en la tabla seccion' });
//     }
//   });

//   const sql = 'UPDATE aula SET disponibilidad = 1 WHERE id_aula = ?';

//   db.query(sql, [id_aula], (err, results) => {
//     if (err) {
//       console.error('Error al actualizar la disponibilidad: ', err);
//       return;
//     }
//     console.log('Disponibilidad actualizada correctamente');
//     console.log(results);
//   });

//   const sqlunidades = 'UPDATE docente SET unidades_valo';

//   db.query(sqlunidades, [unidades_valo], (err, results) => {
//     if (err) {
//       console.error('Error al actualizar la disponibilidad: ', err);
//       return;
//     }
//     console.log('Disponibilidad actualizada correctamente');
//     console.log(results);
//   });
// }

export const insertarSeccion = (req, res) => {
  const {
    id_clase,
    anio,
    periodo,
    num_empleado,
    id_aula,
    dias,
    cupos,
    id_edificio,
    horainicio,
    horafin,
    unidades_valo
  } = req.body;

  const query = `
    INSERT INTO seccion
    (id_clase, anio, periodo, num_empleado, id_aula, dias, cupos, id_edificio, horainicio, horafin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id_clase,
    anio,
    periodo,
    num_empleado,
    id_aula,
    dias,
    cupos,
    id_edificio,
    horainicio,
    horafin
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      res.status(500).json({ error: 'Error al insertar datos en la tabla seccion' });
    } else {
      res.status(201).json({ message: 'Datos insertados correctamente en la tabla seccion' });
    }
  });

  const sql = 'UPDATE aula SET disponibilidad = 1 WHERE id_aula = ?';

  db.query(sql, [id_aula], (err, results) => {
    if (err) {
      console.error('Error al actualizar la disponibilidad: ', err);
      return;
    }
    console.log('Disponibilidad actualizada correctamente');
    console.log(results);
  });

  const sqlunidades = 'UPDATE docente SET unidades_valo = unidades_valo - ? WHERE num_empleado = ?';

  db.query(sqlunidades, [unidades_valo, num_empleado], (err, results) => {
    if (err) {
      console.error('Error al actualizar las unidades valorativas: ', err);
      return;
    }
    console.log('Unidades valorativas actualizadas correctamente');
    console.log(results);
  });
}

    


// Define la ruta para tu consulta
export const consultaDocente = (req, res) => {
  const query = `
    SELECT s1.id_seccion, s1.num_empleado, s1.horainicio
    FROM seccion s1
    WHERE NOT EXISTS (
      SELECT 1
      FROM seccion s2
      WHERE s1.num_empleado = s2.num_empleado
      AND s1.horainicio = s2.horainicio
      AND s1.id_seccion <> s2.id_seccion
    )
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ' + err.stack);
      res.status(500).send('Error interno del servidor');
      return;
    }

    // Envía los resultados de la consulta como respuesta JSON
    res.json(results);
  });
};


//desde aqui modifique
export const VerificarHorarioDocente = (req, res) => {

  const { num_empleado, horaInicial, minutoInicial, horaFinal, minutoFinal } = req.query;
  const horaInicio = horaInicial + ':' + minutoInicial;
  const horaFin = horaFinal + ':' + minutoFinal;

  const query = `
    SELECT d.nombres, d.apellidos, d.correo, d.cargo,
           a.horainicio AS hora_inicio_aula, a.horafin AS hora_fin_aula
    FROM docente d
    JOIN seccion s ON d.num_empleado = s.num_empleado
    JOIN aula a ON s.id_aula = a.id_aula
    WHERE d.num_empleado = ? AND a.horainicio = ? AND a.horafin = ?;
  `;

  db.query(query, [num_empleado, horaInicio, horaFin], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
      return;
    }

    const hasData = results.length > 0;
    res.json({ hasData }); //hasData, que será true si hay datos y false si no los hay.
  });
}