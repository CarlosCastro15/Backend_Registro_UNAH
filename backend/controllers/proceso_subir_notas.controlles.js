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


  //------------
  //ENDPOINT: para crear un proceso de subir notas
  export const ingresarProcesoSubidaNotas = (req, res) => {
    const {anio,periodo,fechainicioI,fechainicioII} = req.body;
  
    // Consulta SQL para insertar los datos en la tabla "proceso"
    const sql = `INSERT INTO proceso_subir_notas (anio,periodo,fechainicioI,fechainicioII) VALUES (?, ?, ?, ?)`;
  
    // Ejecutar la consulta SQL con los datos proporcionados
    db.query(sql, [anio,periodo,fechainicioI,fechainicioII], (error, results) => {
      if (error) {
        console.error('Error al ingresar los datos:', error);
        res.status(500).json({ error: 'Error al ingresar los datos' });
      } else {
        res.json({ message: 'Datos ingresados correctamente' });
      }
    });
  }

//------------
//ENDPOINT para traer los procesos de subir nota
  export const getProcesosSubirNotas = (req, res) => {
    db.query('SELECT * FROM proceso_subir_notas', (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
      } else {
        res.json(results);
      }
    });
  };