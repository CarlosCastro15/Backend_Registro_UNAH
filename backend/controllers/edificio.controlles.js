import { db } from '../db.js'
import jwt from'jsonwebtoken'
import nodemailer from'nodemailer'


export const EdificioID = (req, res) => {
    
      // Consulta a la base de datos
      const query = `SELECT * FROM edificio`;
    
      db.query(query, (err, rows) => {
        if (err) {
          console.error('Error al ejecutar la consulta: ', err);
          res.status(500).send('Error del servidor');
        } else {
          res.json(rows);
        }
      });
}

export const aulasDisponibles = (req, res) => {
    const query = `SELECT aula.*, edificio.nombre
                  FROM aula
                  INNER JOIN edificio ON aula.id_edificio = edificio.id_edificio
                  WHERE aula.disponibilidad = true
                  AND NOT EXISTS (
                  SELECT 1
                  FROM aula a2
                  WHERE a2.disponibilidad = true
                  AND aula.id_aula <> a2.id_aula
                  AND aula.horainicio = a2.horainicio
                  AND aula.num_aula = a2.num_aula
                  AND aula.id_edificio = a2.id_edificio)`;
  
    // Ejecutar la consulta
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send('Error en el servidor');
        return;
      }
  
      // Enviar los resultados como respuesta
      res.json(results);
    });
  }

  export const proceso = (req, res) => {
    
    // Consulta a la base de datos
    const query = `SELECT * FROM proceso`;
  
    db.query(query, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ', err);
        res.status(500).send('Error del servidor');
      } else {
        res.json(rows);
      }
    });
}

export const ingresarProceso = (req, res) => {
  const {anio,periodo,horainicio,horafin,indiceI,fechainicioI,indiceII,fechainicioII,indiceIII,fechainicioIII,indiceIIII,fechainicioIIII,indiceIIIII,fechainicioIIIII} = req.body;

  // Consulta SQL para insertar los datos en la tabla "proceso"
  const sql = `INSERT INTO proceso (anio,periodo,horainicio,horafin,indiceI,fechainicioI,indiceII,fechainicioII,indiceIII,fechainicioIII,indiceIIII,fechainicioIIII,indiceIIIII,fechainicioIIIII) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Ejecutar la consulta SQL con los datos proporcionados
  db.query(sql, [anio,periodo,horainicio,horafin,indiceI,fechainicioI,indiceII,fechainicioII,indiceIII,fechainicioIII,indiceIIII,fechainicioIIII,indiceIIIII,fechainicioIIIII
  ], (error, results) => {
    if (error) {
      console.error('Error al ingresar los datos:', error);
      res.status(500).json({ error: 'Error al ingresar los datos' });
    } else {
      res.json({ message: 'Datos ingresados correctamente' });
    }
  });
}

export const eliminarProceso = (req, res) => {
  const id = req.params.id;

  // Consulta SQL para eliminar la tabla "proceso" si el ID coincide
  const sql = `DELETE FROM proceso WHERE id = ${id}`;

  // Ejecutar la consulta SQL con el ID proporcionado
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar la tabla:', error);
      res.status(500).json({ error: 'Error al eliminar la tabla' });
    } else {
      res.json({ message: 'Proceso eliminada correctamente' });
    }
  });
}


