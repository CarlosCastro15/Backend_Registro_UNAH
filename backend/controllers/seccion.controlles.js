
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
    const { carreraId, centroId, anio, periodo } = req.params;
  
    const query = `
      SELECT 
        s.id_seccion,
        s.cupos,
        s.id_clase,
        c.nombre AS nombre_clase,
        s.num_empleado,
        CONCAT(d.nombres, ' ', d.apellidos) AS nombre_empleado,
        s.id_edificio,
        e.nombre AS nombre_edificio,
        s.id_aula,
        a.num_aula 
      FROM
        seccion AS s
      INNER JOIN clase AS c ON s.id_clase = c.id_clase
      INNER JOIN docente AS d ON s.num_empleado = d.num_empleado
      INNER JOIN edificio AS e ON s.id_edificio = e.id_edificio
      INNER JOIN aula AS a ON s.id_aula = a.id_aula
      INNER JOIN proceso AS p ON s.anio = p.anio AND s.periodo = p.periodo
      INNER JOIN carrera AS carr ON c.id_carrera = carr.id
      INNER JOIN centro AS centro ON carr.centro_id = centro.id
      WHERE
        carr.id = ?
        AND centro.id = ?
        AND p.anio = ?
        AND p.periodo = ?;
    `;
  
    db.query(query, [carreraId, centroId, anio, periodo], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al obtener las secciones' });
        return;
      }
  
      res.json(results);
    });
  };