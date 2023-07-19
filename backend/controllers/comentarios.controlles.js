import { db } from '../db.js'

export const insertarComentarios = (req, res) => {
    const sql = `INSERT INTO comentarios (id_seccion, num_empleado,num_cuenta, comentarioI, comentarioII, comentarioIII, comentarioIIII, comentarioIIIII, comentarioIIIIII) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const { id_seccion, num_empleado, num_cuenta, comentarioI, comentarioII, comentarioIII, comentarioIIII, comentarioIIIII, comentarioIIIIII } = req.body;
  
    const values = [id_seccion, num_empleado,num_cuenta, comentarioI, comentarioII, comentarioIII, comentarioIIII, comentarioIIIII, comentarioIIIIII];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al insertar el comentario: ' + err.stack);
        return res.status(500).send('Error al insertar el comentario.');
      }
  
      const query = `UPDATE evaluardocente SET evaluado = true WHERE id_seccion = ? AND num_empleado = ?`;
  
      db.query(query, [id_seccion, num_empleado, num_cuenta], (err, result) => {
        if (err) {
          console.error('Error al actualizar el campo evaluado: ' + err.stack);
          return res.status(500).send('Error al actualizar el campo evaluado.');
        }
  
        console.log('Comentario insertado y campo evaluado actualizado correctamente.');
        return res.status(200).send('Comentario insertado y campo evaluado actualizado correctamente.');
      });
    });
  };


  export const clasesPeiodoEstudiante = (req, res) => {
    const idEstudiante = req.params.idEstudiante;
    const anio = req.params.anio;
    const periodo = req.params.periodo;
  
    const consulta = `
      SELECT c.nombre AS nombre_clase, s.id_seccion, cp.nota, ed.num_empleado, ed.evaluado, cp.id_estudiante
      FROM seccion s
      JOIN clase c ON c.id_clase = s.id_clase
      JOIN clase_pasada cp ON cp.id_clase = c.id_clase
      JOIN evaluardocente ed ON ed.id_seccion = s.id_seccion
      WHERE cp.id_estudiante = ?
      AND EXISTS (
        SELECT 1
        FROM proceso p
        WHERE p.anio = ?
        AND p.periodo = ?
      );
    `;
  
    // Ejecuta la consulta en la base de datos con los parámetros proporcionados
    db.query(consulta, [idEstudiante, anio, periodo], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
      } else {
        res.json(results);
      }
    });
  };
  
    
  export const anioperiodo = (req, res) => {
    const sqlQuery = 'SELECT anio, periodo FROM proceso WHERE disponibilidad = 1';
  
    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al obtener los datos' });
        return;
      }
  
      res.json(results);
    });
  };