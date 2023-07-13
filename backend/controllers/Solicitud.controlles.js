import { db } from '../db.js';

export const crearSolicitud = (req, res) => {
  const { tipo_solicitud, num_cuenta, justificacion } = req.body;
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

  const query = `INSERT INTO solicitud (tipo_solicitud, num_cuenta, num_empleado, justificacion, estado) VALUES (?, ?, ?, ?, ?)`;
  
 
  db.query(consultaDocente, [num_cuenta], (error, results) => {
    if (error) {
      console.error('Error al obtener el num_empleado del Coordinador:', error);
      res.status(500).json({ error: 'Error al guardar la solicitud' });
    } else {
      const num_empleado = results[0]?.num_empleado;
      
    
      const values = [tipo_solicitud, num_cuenta, num_empleado, justificacion, estado];
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
    const { num_empleado } = req.query;;
    const values = [num_empleado,];
    const query = `
      SELECT *
      FROM solicitud
      WHERE num_empleado = ?
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