import { db } from '../db.js'
import jwt from'jsonwebtoken'
import nodemailer from'nodemailer'

//clases por medio del nombre de la carrera 
export const clasesCarrera = (req, res) => {
    const nombreCarrera = req.params.nombre;
    
    const sql = `SELECT *
                FROM clase c
                JOIN seccion s ON c.id_clase = s.id_clase
                JOIN docente d ON s.num_empleado = d.num_empleado
                JOIN carrera ca ON d.carrera_id = ca.id
                WHERE ca.nombre = ?`;
  
    // Ejecutar la consulta con los parámetros proporcionados
    db.query(sql, [nombreCarrera], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.json(results);
    });
  }