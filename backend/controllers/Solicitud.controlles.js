import { db } from '../db.js';
import path  from 'path'
export const crearSolicitud = (req, res) => {
  const { tipo_solicitud, num_cuenta, justificacion, id_carrera, id_centro, id_clase } = req.body;
  const nombre_archivo = path.basename(req.file.path);
  const estado = "Pendiente";
  const consultaDocente = `
    SELECT d.num_empleado
    FROM docente d
    INNER JOIN carrera c ON d.carrera_id = c.id
    INNER JOIN estudiante e ON c.id = e.carrera_id
    WHERE e.num_cuenta = ?
      AND d.cargo = 'Coordinador'
      AND d.centro_id = e.centro_id
      AND d.carrera_id = e.carrera_id
  `;
  const query = `INSERT INTO solicitud (tipo_solicitud, num_cuenta, num_empleado, justificacion,
     estado, id_carrera, id_centro, id_clase,documento)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(consultaDocente, [num_cuenta], (error, results) => {
    if (error) {
      console.error('Error al obtener el num_empleado del Coordinador:', error);
      res.status(500).json({ error: 'Error al guardar la solicitud' });
    } else {
      const num_empleado = results[0]?.num_empleado;
      
      
      const idCarrera =!isNaN (id_carrera) ? parseInt(id_carrera) : null;
      const idCentro = !isNaN(id_centro) ? parseInt(id_centro) : null;
      const idClase = !isNaN(id_clase) ? parseInt(id_clase) : null;

      const values = [tipo_solicitud, num_cuenta, num_empleado, justificacion, estado, idCarrera, idCentro, idClase, nombre_archivo];
      db.query(query, values, (error, results) => {
        if (error) {
          console.error('Error al guardar la solicitud:', error);
          res.status(500).json({ error: 'Error al guardar la solicitud' });
        } else {
          res.status(201).json({ message: 'Solicitud creada correctamente' });
          console.log('Solicitud guardada:', results);
        }
      });
    }
  });
};









export const obtenerSolicitudesPorCoordinador = (req, res) => {
  const { num_empleado } = req.query;
  const values = [num_empleado];
  const query = `
    SELECT
      solicitud.*,
      COALESCE(carrera.nombre, ' ') AS nombre_carrera,
      COALESCE(centro.nombre, ' ') AS nombre_centro
    FROM
      solicitud
    LEFT JOIN
      carrera ON solicitud.id_carrera = carrera.id
    LEFT JOIN
      centro ON solicitud.id_centro = centro.id
    WHERE
      solicitud.num_empleado = ? 
  `;

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al obtener las solicitudes del coordinador:', error);
      res.status(500).json({ error: 'Error al obtener las solicitudes del coordinador' });
    } else {
      res.status(200).json(results);
      console.log('Solicitudes obtenidas:', results);
    }
  });
};

  
  export const obtenerSolicitudEs = (req, res) => {
    const { num_cuenta } = req.query;
    const values = [num_cuenta,];
    const query = `
    SELECT *
    FROM solicitud
    WHERE num_cuenta = ? 
  `;
  
    db.query(query,values, (error, results) => {
      if (error) {
        console.error('Error al obtener las solicitudes del coordinador:', error);
        res.status(500).json({ error: 'Error al obtener las solicitudes del coordinador' });
      } else {
        res.status(200).json(results);
        console.log('Solicitudes obtenidas:', results);
      }
    });
  };
  export const Centro = (req, res) => {
  
  
    // Consulta a la base de datos
    const query = `SELECT * FROM centro`;
  
    db.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ', err);
        res.status(500).send('Error del servidor');
      } else {
        res.json(rows);
      }
    });
  }
  const actualizarCarreraEstudiante = (num_cuenta, id_carrera) => {
    const query = `
      UPDATE estudiante
      SET carrera_id = ?
      WHERE num_cuenta = ?
    `;
    const values = [id_carrera, num_cuenta];
  
    db.query(query, values, (error, result) => {
      if (error) {
        console.error('Error al actualizar la carrera del estudiante:', error);
      } else {
        console.log('Carrera del estudiante actualizada:', result);
      }
    });
  };
  
  // Función para actualizar el centro del estudiante en la tabla estudiante
  const actualizarCentroEstudiante = (num_cuenta, id_centro) => {
    const query = `
      UPDATE estudiante
      SET centro_id = ?
      WHERE num_cuenta = ?
    `;
    const values = [id_centro, num_cuenta];
  
    db.query(query, values, (error, result) => {
      if (error) {
        console.error('Error al actualizar el centro del estudiante:', error);
      } else {
        console.log('Centro del estudiante actualizado:', result);
      }
    });
  };
  
  // Función para actualizar el campo "Pago_repo" del estudiante en la tabla estudiante
  const actualizarPagoReposicionEstudiante = (num_cuenta) => {
    const query = `
      UPDATE estudiante
      SET Pago_reposolicitud = 1
      WHERE num_cuenta = ?
    `;
    const values = [num_cuenta];
  
    db.query(query, values, (error, result) => {
      if (error) {
        console.error('Error al actualizar el pago de reposición del estudiante:', error);
      } else {
        console.log('Pago de reposición del estudiante actualizado:', result);
      }
    });
  };
  
  export const ActualizarEstado = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const { observacion } = req.body;

  // Consultar la solicitud para obtener los datos necesarios
  const selectQuery = `
  SELECT s.tipo_solicitud, s.num_cuenta, s.id_carrera, s.id_centro, s.id_clase, e.correo_institucional
  FROM solicitud s
  JOIN estudiante e ON s.num_cuenta = e.num_cuenta
  WHERE s.id = ?;
`;
  const selectValues = [id];

  db.query(selectQuery, selectValues, (err, result) => {
    if (err) {
      console.error("Error al obtener los datos de la solicitud:", err);
      res.status(500).send("Error del servidor");
    } else {
      if (result.length === 0) {
        res.status(404).send("Solicitud no encontrada");
      } else {
        const { tipo_solicitud, num_cuenta, id_carrera, id_centro, id_clase} = result[0];

        // Actualizar el estado en la tabla de solicitud
        const updateEstadoQuery = `
        UPDATE solicitud
        SET estado = ?, observacion = ?
        WHERE id = ?
        `;
        const updateEstadoValues = [estado, observacion,id];

        db.query(updateEstadoQuery, updateEstadoValues, (err, result) => {
          if (err) {
            console.error("Error al actualizar el estado de la solicitud:", err);
            res.status(500).send("Error del servidor");
          } else {
            if (estado === "Aprobada") {
              switch (tipo_solicitud) {
                case "Cambio de Carrera":                  
                  actualizarCarreraEstudiante(num_cuenta, id_carrera);
                  break;
                case "Cambio de Centro":                 
                  actualizarCentroEstudiante(num_cuenta, id_centro);
                  break;
                case "Pago Reposición":                  
                  actualizarPagoReposicionEstudiante(num_cuenta);
                  break;              
                default:                  
                  break;
              }
            }
            res.sendStatus(200);
          }
        });
      }
    }
  });
};

export const PagoReposicionEstudiante = (req, res) => {
  const num_cuenta = req.params.num_cuenta; 
  const query = `
    SELECT Pago_reposolicitud FROM estudiante WHERE num_cuenta = ?
  `;
  const values = [parseInt(num_cuenta, 10)]; 

  db.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al obtener el pago de reposición:', error);
      res.status(500).json({ error: 'Error al obtener el pago de reposición' });
    } else {
      if (result.length > 0) {
        const pagoReposicion = result[0].Pago_reposolicitud;
        res.status(200).json({ Pago_reposolicitud: pagoReposicion });
      } else {
        res.status(404).json({ error: 'No se encontró el estudiante con el número de cuenta proporcionado' });
      }
    }
  });
};


