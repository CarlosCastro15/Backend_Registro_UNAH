import {db} from '../db.js'
import jwt from'jsonwebtoken';


export const docentePorCarrera = (req, res) => {
 
    const columna = req.params.columna;
    const valor = req.params.valor;

        const sql = `SELECT * FROM docente WHERE ${columna} = ${valor}`;
        db.query(sql, (err, results) => {
          if (err) {
            console.error('Error al ejecutar la consulta: ', err);
            res.status(500).json({ error: 'Error al obtener los datos del Docente' });
            return;
          }
      
          if (results.length === 0) {
            res.status(404).json({ error: 'Docente no encontrado' });
            return;
          }
      
          const estudiante = results[0];
          res.json(estudiante);
        });
}

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

//TRAER DOCENTE SEGUN CARRERA
export const docenteCarrera = (req, res) => {
  const nombreCarrera = req.params.nombre;

  // Construir la consulta SQL para obtener los docentes según la carrera
  const query = `SELECT Docentes.num_empleado, Docentes.nombres, Docentes.cargo, Carreras.nombre
                FROM Docentes
                JOIN Carreras ON Carreras.docente_id = Docentes.num_empleado 
                WHERE Carreras.nombre = ?`;

  // Ejecutar la consulta en la base de datos
  db.query(query, [nombreCarrera], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los docentes.' });
    } else {
      res.json(results);
    }
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
