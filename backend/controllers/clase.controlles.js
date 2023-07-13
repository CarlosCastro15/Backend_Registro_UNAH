import { db } from '../db.js'
import jwt from'jsonwebtoken'
import nodemailer from'nodemailer'

//clases por medio del nombre de la carrera 
export const clasesCarrera = (req, res) => {
    const nombreCarrera = req.params.nombre;
    
    const sql = `SELECT cl.id_clase, cl.nombre AS nombre_clase
                 FROM carrera c
                 JOIN clase cl ON c.id = cl.id_carrera
                 WHERE c.nombre = ? `;
  
    // Ejecutar la consulta con los parámetros proporcionados
    db.query(sql, [nombreCarrera], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.json(results);
    });
  }