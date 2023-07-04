import {db} from '../db.js'
import fs from 'fs';

  export const cargarimagen = (req, res) => {
    
    const { nombre_archivo, id_estudiante, id_docente } = req.body;
  const fotoPath = req.file.path;

  const query = `INSERT INTO imagen (nombre_archivo, id_estudiante, id_docente) VALUES (?, ?, ?)`;
  const values = [fotoPath, id_estudiante, id_docente];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al guardar la imagen en la base de datos:', error);
      res.status(500).json({ error: 'Error al guardar la imagen en la base de datos' });
    } else {
      console.log('Imagen guardada correctamente en la base de datos');
      res.status(200).json({ message: 'Imagen guardada correctamente en la base de datos' });
    }
  });
}

//obtenerImagenes 

export const obtenerImagenes  = (req, res) => {
  const { id_estudiante, id_docente } = req.query;

  const query = `SELECT id, nombre_archivo FROM imagen WHERE id_estudiante = ? OR id_docente = ?`;
  const values = [id_estudiante, id_docente];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al obtener las imágenes de la base de datos:', error);
      res.status(500).json({ error: 'Error al obtener las imágenes de la base de datos' });
    } else {
      const imagenes = results.map((imagen) => ({
        id: imagen.id,
        url: `\\${imagen.nombre_archivo}`
      }));
      res.status(200).json(imagenes);
    }
  });
};

