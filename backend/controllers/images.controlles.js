import {db} from '../db.js'

import path  from 'path'
  export const cargarimagen = (req, res) => {
    
    const { nombre_archivo, id_estudiante, id_docente } = req.body;
  const fotoPath = path.basename(req.file.path);;

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
        url: `http://localhost:8081/${imagen.nombre_archivo}`,
        nombre: imagen.id,
      }));
      res.status(200).json(imagenes);
    }
  });
};

export const eliminarImagen = (req, res) => {
  const { id, nombre_archivo } = req.body;

  const query = 'DELETE FROM imagen WHERE id = ? AND nombre_archivo = ?';
  const values = [id, nombre_archivo];
  console.log(req.body)

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
      res.status(500).json({ error: 'Error al eliminar la imagen de la base de datos' });
    } else {
      if (results.affectedRows === 0) {
        console.log('La imagen no existe en la base de datos');
        res.status(404).json({ error: 'La imagen no existe en la base de datos' });
      } else {
        console.log('Imagen eliminada correctamente de la base de datos');
        res.status(200).json({ message: 'Imagen eliminada correctamente de la base de datos' });
      }
    }
  });
};



