
import { db } from '../db.js'


export const crearSeccion = (req, res) => {
    const sql = "INSERT INTO seccion (id_clase, num_empleado, id_aula, dias, cupos, id_edificio) VALUES (?,?,?,?,?,?)";
    const {id_clase, num_empleado, id_aula, dias, cupos, id_edificio } = req.body;
  
    const values = [id_clase, num_empleado, id_aula, dias, cupos, id_edificio];
  
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
  
  
  export const eliminarSeccion = (req, res) => {
    const id = req.params.id_seccion;
  
    // Consulta SQL para eliminar la tabla "proceso" si el ID coincide
    const sql = `DELETE FROM seccion WHERE id = ${id}`;
  
    // Ejecutar la consulta SQL con el ID proporcionado
    db.query(sql, [id], (error, results) => {
      if (error) {
        console.error('Error al eliminar la tabla:', error);
        res.status(500).json({ error: 'Error al eliminar la tabla' });
      } else {
        res.json({ message: 'Seccion eliminada correctamente' });
      }
    });
  }
  
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
  
    const sql = 'UPDATE secciom SET cupos = ? WHERE id_seccion = ?';
    db.query(sql, [idSeccion, nuevoCupos], (error, results) => {
      if (error) {
        console.error('Error al actualizar los cupos:', error);
        res.status(500).send('Error al actualizar los cupos de la seccion');
      } else {
        res.send('Se actualizaron los cupos correctamente');
      }
    });
  }