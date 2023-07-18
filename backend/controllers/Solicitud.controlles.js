import { db } from '../db.js';

export const crearSolicitud = (req, res) => {
  const { tipo_solicitud, num_cuenta, justificacion ,id_carrera,id_centro,id_clase} = req.body;
  const estado = "pendiente";

  const consultaDocente = `
    SELECT d.num_empleado
    FROM docente d
    INNER JOIN carrera c ON d.carrera_id = c.id
    INNER JOIN estudiante e ON c.id = e.carrera_id
    WHERE e.num_cuenta = ?
      AND d.cargo = 'Coordinador'
      AND d.centro_id = e.centro_id
      AND d.carrera_id = e.carrera_id
    LIMIT 1
  `;

  const query = `INSERT INTO solicitud (tipo_solicitud, num_cuenta, num_empleado, justificacion,
     estado,id_carrera,id_centro,id_clase) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
 
  db.query(consultaDocente, [num_cuenta], (error, results) => {
    if (error) {
      console.error('Error al obtener el num_empleado del Coordinador:', error);
      res.status(500).json({ error: 'Error al guardar la solicitud' });
    } else {
      const num_empleado = results[0]?.num_empleado;
      
    
      const values = [tipo_solicitud, num_cuenta, num_empleado, justificacion, estado ,id_carrera,id_centro,id_clase];
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
      solicitud.num_empleado = ? AND solicitud.estado = 'pendiente'
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
    const { num_cuenta } = req.query;;
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
  export const ActualizarEstado = (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const query = `
      UPDATE solicitud
      SET estado = ?
      WHERE id = ?
    `;
    const values = [estado, id];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar el estado de la solicitud:", err);
        res.status(500).send("Error del servidor");
      } else {
        res.sendStatus(200);
      }
    });
  };