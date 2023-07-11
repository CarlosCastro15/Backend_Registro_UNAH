import {db} from '../db.js'

import path  from 'path'
  export const cargarvideo = (req, res) => {
    
    const { nombre_archivo, id_docente } = req.body;
  const fotoPath = path.basename(req.file.path);;

  const query = `INSERT INTO video (nombre_archivo, id_docente) VALUES (?, ?)`;
  const values = [fotoPath, id_docente];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al guardar el video en la base de datos:', error);
      res.status(500).json({ error: 'Error al guardar el video en la base de datos' });
    } else {
      console.log('Video guardado correctamente en la base de datos');
      res.status(200).json({ message: 'Video guardada correctamente en la base de datos' });
    }
  });
}

//ObtenerVideo 

export const obtenerVideo  = (req, res) => {
    const {id_docente } = req.query;
  
    const query = `SELECT id, nombre_archivo FROM video WHERE id_docente = ?`;
    const values = [id_docente];
  
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al obtener el video de la base de datos:', error);
        res.status(500).json({ error: 'Error al obtener el video de la base de datos' });
      } else {
        const imagenes = results.map((video) => ({
          id: video.id,
          url: `http://localhost:8081/${video.nombre_archivo}`,
          nombre: video.nombre_archivo,
        }));
        res.status(200).json(imagenes);
      }
    });
  };


  export const eliminarVideo = (req, res) => {
    const { id } = req.body;
  
    const query = 'DELETE FROM video WHERE id = ? ';
    const values = [id];
    console.log(req.body)
  
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al eliminar el video de la base de datos:', error);
        res.status(500).json({ error: 'Error al eliminar el video de la base de datos' });
      } else {
        if (results.affectedRows === 0) {
          console.log('el video no existe en la base de datos');
          res.status(404).json({ error: 'el video no existe en la base de datos' });
        } else {
          console.log('video eliminada correctamente de la base de datos');
          res.status(200).json({ message: 'video eliminada correctamente de la base de datos' });
        }
      }
    });
  };