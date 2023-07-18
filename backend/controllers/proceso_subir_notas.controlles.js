import { db } from '../db.js'

 export const subirDiscponibilidad = (req, res) => {
    db.query('SELECT * FROM proceso_subir_notas WHERE disponibilidad = TRUE', (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
      } else {
        res.json(results);
      }
    });
  };

  export const actualizarDisponibilidad = (req, res) => {
    const id = req.params.id;
    const disponibilidad = req.body.disponibilidad;
  
    // Consulta SQL para actualizar la disponibilidad
    const sql = `UPDATE proceso_subir_notas
                 SET disponibilidad = ?
                 WHERE id = ?`;
  
    // Ejecutar la consulta con los valores proporcionados
    db.query(sql, [disponibilidad, id], (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ', err);
        res.status(500).json({ error: 'Error al actualizar la disponibilidad' });
      } else {
        res.status(200).json({ message: 'Disponibilidad actualizada correctamente' });
      }
    });
  };