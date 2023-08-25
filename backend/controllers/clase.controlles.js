import { db } from '../db.js'
import jwt from'jsonwebtoken'
import nodemailer from'nodemailer'

//clases por medio del nombre de la carrera 
export const clasesCarrera = (req, res) => {
    const nombreCarrera = req.params.nombre;
    
    const sql = `SELECT cl.id_clase, cl.codigo, cl.unidades_valo, cl.nombre AS nombre_clase
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

//te trae las clases del estudiante que todavia no ha pasado (segun num_cuenta) //DAVID
export const clasesNoPasadas = (req, res) => {
    const numCuenta = req.params.num_cuenta;
  
    // Consulta SQL
    const sqlQuery = `
      SELECT cl.id_clase, cl.nombre
      FROM clase cl
      WHERE cl.id_carrera = (
          SELECT carrera_id
          FROM estudiante
          WHERE num_cuenta = ?
      )
      AND cl.id_clase NOT IN (
          SELECT cp.id_clase
          FROM clase_pasada cp
          WHERE cp.id_estudiante = ?
      )
    `;
  
    // Ejecución de la consulta
    db.query(sqlQuery, [numCuenta, numCuenta], (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta: ', error);
        res.status(500).json({ error: 'Error al ejecutar la consulta' });
      } else {
        res.json(results);
      }
    });
  };

  //Para Roberto
  export const edificioAula = (req, res) => {
    const { id_edificio, horainicio, horafin, dias } = req.query;
  
    const sql = `
      SELECT *
      FROM aula
      WHERE id_edificio = ? 
      AND horainicio = ?
      AND horafin = ?
      AND dias = ?
    `;
  
    db.query(sql, [id_edificio, horainicio, horafin, dias], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ' + err.message);
        res.status(500).json({ error: 'Error en el servidor' });
      } else {
        res.json({ results });
      }
    });
  }