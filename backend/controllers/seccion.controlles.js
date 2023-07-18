
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
    // Obtener los parámetros de la URL
    const carreraId = req.params.carreraId;
    const centroId = req.params.centroId;
    const periodoId = req.params.periodoId;
  
    // Consulta SQL con parámetros
    const sql = `
      SELECT
        seccion.id_seccion,
        seccion.cupos,
        seccion.id_clase,
        clase.nombre AS nombre_clase,
        seccion.num_empleado,
        CONCAT(docente.nombres, ' ', docente.apellidos) AS nombre_empleado,
        seccion.id_edificio,
        edificio.nombre AS nombre_edificio,
        seccion.id_aula,
        aula.num_aula
      FROM
        seccion
      JOIN
        clase ON seccion.id_clase = clase.id_clase
      JOIN
        docente ON seccion.num_empleado = docente.num_empleado
      JOIN
        edificio ON seccion.id_edificio = edificio.id_edificio
      JOIN
        aula ON seccion.id_aula = aula.id_aula
      JOIN
        carrera ON clase.id_carrera = carrera.id
      JOIN
        centro ON carrera.centro_id = centro.id
      JOIN
        periodo ON seccion.id_periodo = periodo.id_periodo
      WHERE
        docente.carrera_id = ? AND
        docente.centro_id = ? AND
        periodo.id_periodo = ?
      ORDER BY
        seccion.num_empleado ASC,
        seccion.id_edificio ASC;
    `;
  
    // Ejecutar la consulta SQL con parámetros
    db.query(sql, [carreraId, centroId, periodoId], (err, result) => {
      if (err) {
        throw err;
      }
      // Enviar el resultado de la consulta como respuesta
      res.json(result);
    });
  };