import {db} from '../db.js'


  export const cargarimagen = (req, res) => {
    
    const { nombre_archivo, id_estudiante, id_docente } = req.body;
  const fotoPath = req.file.path;

  const query = `INSERT INTO imagenes (nombre_archivo, id_estudiante, id_docente) VALUES (?, ?, ?)`;
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
