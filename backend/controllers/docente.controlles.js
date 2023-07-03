import {db} from '../db.js'
import jwt from'jsonwebtoken';

//TRAER LAS CARRERAS SEGUN EL CENTRO
export const carrerasCentro = (req, res) => {
const centro = req.params.centro_id;

  // Consulta a la base de datos
  const query = `SELECT * FROM carreras WHERE centro_id = '${centro}'`;

  db.query(query, (err, rows) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      res.status(500).send('Error del servidor');
    } else {
      res.json(rows);
    }
  });
}

//TRAER DOCENTEs SEGUN CARRERA
export const docenteCarreraCentro = (req, res) => {
  const Idcarrera = req.params.carrera;
  const Idcentro = req.params.centro;

  const sql = `SELECT docentes.num_empleado, docentes.nombres, docentes.apellidos, docentes.cargo, carreras.nombre, centros.nombre
    FROM docentes 
    JOIN carreras ON docentes.carrera_id = carreras.id
    JOIN centros  ON carreras.centro_id = centros.id
    WHERE carreras.nombre = ? AND centros.nombre = ? `;

  // Ejecutar la consulta con los parámetros proporcionados
  db.query(sql, [Idcarrera, Idcentro], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });
}



//ACTUALIZAR EL CARGO DEL DOCENTE
export const actualizarCargoDocente = (req, res) => {
  const docenteId = req.params.num_empleado;
  const nuevoRol = req.body.cargo; // asumiendo que se envía el nuevo rol en el cuerpo de la solicitud

  // Construir la consulta SQL para actualizar el rol del docente
  const sql = 'UPDATE docentes SET cargo = ? WHERE num_empleado = ?';

  // Ejecutar la consulta en la base de datos
  db.query(sql, [nuevoRol, docenteId], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el rol del docente.' });
    } else {
      res.json({ message: 'El rol del docente ha sido actualizado.' });
    }
  });
};
