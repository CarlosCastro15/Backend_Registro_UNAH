import { db } from '../db.js'
import jwt from'jsonwebtoken'
import nodemailer from'nodemailer'


export const EdificioID = (req, res) => {
    
      // Consulta a la base de datos
      const query = `SELECT nombre FROM edificio`;
    
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
    const query = `SELECT a.num_aula
      FROM edificio e
      JOIN aula a ON e.id_edificio = a.id_edificio
      JOIN seccion s ON a.id_aula = s.id_aula
      WHERE a.disponibilidad = 1`;
  
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