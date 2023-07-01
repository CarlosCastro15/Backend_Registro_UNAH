import {db} from '../db.js'
import jwt from'jsonwebtoken';

export const getEstudiante = (req, res) => {
    const sql = 'SELECT * FROM estudiante';

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
        if (data.length > 0) {
            const id = data[0].num_cuenta;
            const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

            return res.json({ login: true, usuario: data, token: token });

        } else {
            return res.json({ login: false, msg: 'Sin registro' })
        }
    })
}

//OBTENER NUMERO DE CUENTA, CARRERA, CENTRO Y CORREO INSTITUCIONAL DE ACUERDO AL NUMERO DE CUENTA DEL ESTUDIANTE
export const getEstudianteId = (req, res) => {
    
    const estuId = req.params.num_cuenta;
      
    const sql = `SELECT num_cuenta, carrera, centro, correo_institucional FROM estudiante WHERE num_cuenta = ${estuId}`;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta: ', err);
        res.status(500).json({ error: 'Error al obtener los datos del estudiante' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Estudiante no encontrado' });
        return;
      }
  
      const estudiante = results[0];
      res.json(estudiante);
    });

    /*
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
        if (data.length > 0) {
            const id = data[0].num_cuenta;
            const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

            return res.json({ login: true, usuario: data, token: token });

        } else {
            return res.json({ login: false, msg: 'Sin registro' })
        }
    })*/
}

export const deleteEstudiante = (req, res) => {
    const adminId = req.params.num_cuenta;

    const sql = `DELETE FROM estudiante WHERE num_cuenta = ${adminId}`;
  
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error al eliminar el estudiante:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el estudiante' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ mensaje: 'No se encontró el estudiante' });
        } else {
          res.json({ mensaje: 'estudiante eliminado exitosamente' });
        }
      }
    })
}

export const updateEstudiante = (req, res) => {
        const adminId = req.params.num_cuenta;
        const adminData = req.body; // Se espera que los datos a actualizar se envíen en el cuerpo de la solicitud
      
        const query = `UPDATE estudiante SET ? WHERE num_cuenta = ${adminId}`;
      
        db.query(query, adminData, (error, results) => {
          if (error) {
            console.error('Error al actualizar el administrador:', error);
            res.status(500).json({ mensaje: 'Error al actualizar el estudiante' });
          } else {
            if (results.affectedRows === 0) {
              res.status(404).json({ mensaje: 'No se encontró el estudiante' });
            } else {
              res.json({ mensaje: 'estudiante actualizado exitosamente' });
            }
          }
          /*{
           if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
            if (data.length > 0) {
                const id = data[0].id;
                const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });
    
                return res.json({ login: true, usuario: data, token: token });
    
            } else {
                return res.json({ login: false, msg: 'Sin registro' })
            }
        }*/
        })
      }
