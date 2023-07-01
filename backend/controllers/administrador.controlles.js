import {db} from '../db.js'
import jwt from'jsonwebtoken';

// ENDPOINT: CREAR UN DOCENTE
export const creardocente = (req, res) => {
    // const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const sql = "INSERT INTO docente (nombres, apellidos, identidad, correo, password, foto, centro) VALUES (?,?,?,?,?,?,?)";
    const { nombres, apellidos, identidad, email, password, foto, centro } = req.body;

    const values = [nombres, apellidos, identidad, email, password, foto, centro];

    //la funcion que envie cooreo generado, contraseñagenerada, numCuenta
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
}

// ENDPOINT: INICIO DE SESION DE ADMINISTRADOR
export const sesionadministrador = (req, res) => {
    const sql = "SELECT * FROM administrador WHERE correo = ? AND password = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto

        if (data.length > 0) {
            const id = data[0].id;
            const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

            return res.json({ login: true, usuario: data, token: token });

        } else {
            return res.json({ login: false, msg: 'Sin registro' })
        }

    })
}

// ENDPOINT: INICIO DE SESION DE DOCENTE
export const sesiondocente = (req, res) => {
    const sql = "SELECT * FROM docente WHERE correo = ? AND password = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto

        if (data.length > 0) {
            const id = data[0].id;
            const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

            return res.json({ login: true, usuario: data, token: token });

        } else {
            return res.json({ login: false, msg: 'Sin registro' })
        }

    })
}

// ENDPOINT: INICIO DE SESION DE ESTUDIANTE
export const sesionestudiante = (req, res) => {
    const sql = "SELECT * FROM estudiante WHERE correo_institucional = ? AND password_institucional = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto

        if (data.length > 0) {
            const id = data[0].id;
            const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

            return res.json({ login: true, usuario: data, token: token });

        } else {
            return res.json({ login: false, msg: 'Sin registro' })
        }

    })
}

// ENDPOINT: REGISTRAR ESTUDIANTES DESDE UN CSV
export const registroCSV = async (req, res) => {
    const jsonData = req.body; //recibo un json

    try {
        const maximo = await obtenerMaximoContador();
        const max = maximo;
        console.log(max);
        var cont = 1;

        for (const obj of jsonData) {
            const { resultado, anio, cuatrimestre } = generarNumeroCuenta(max + cont);
            const sql = 'INSERT INTO estudiante (num_cuenta, anio, cuatrimestre, contador, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, identidad, carrera, direccion, correo_personal, centro, correo_institucional, password_institucional) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?)';
            const values = [resultado, anio, cuatrimestre, (max + cont), obj.primer_nombre, obj.segundo_nombre, obj.primer_apellido, obj.segundo_apellido, obj.identidad, obj.carrera, obj.direccion, obj.correo_personal, obj.centro, generarCorreo(obj.primer_nombre, resultado), generarContrasena()];

            await new Promise((resolve, reject) => {
                db.query(sql, values, (error, results) => {
                    if (error) {
                        console.error('Error al guardar los datos:', error);
                        reject(error);
                    } else {
                        cont++;
                        console.log('Datos guardados:', results);
                        resolve();
                    }
                });
            });
        }

        res.json({ message: 'Datos guardados correctamente' });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
}

//FUNCIONES
// Obtener el número máximo de la columna "contador" de la tabla "estudiante"
const obtenerMaximoContador = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(contador) AS maximo FROM estudiante';

        db.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const maximo = results[0].maximo;
                resolve(maximo);
            }
        });
    });
};

//En el correo vamos añadirle los ultimos 4 digitos del numero de cuenta
// angel.1000@unah.edu

const generarCorreo = (nombre, numcuenta) => {
    var correo = nombre.toLowerCase() + "." + numcuenta + "@unah.hn";
    return correo;
}

const generarNumeroCuenta = (cont) => {
    var fechaActual = new Date();
    var anio = fechaActual.getFullYear();


    // Obtener el mes actual (0-11, donde 0 es enero y 11 es diciembre)
    var mes = fechaActual.getMonth();
    var cuatrimestre;

    if (mes >= 0 && mes <= 3) {
        cuatrimestre = 100;
    } else if (mes >= 4 && mes <= 7) {
        cuatrimestre = 102;
    } else if (mes >= 8 && mes <= 11) {
        cuatrimestre = 103;
    }
   
    var result = anio.toString() + cuatrimestre.toString() + cont.toString()
    var resultado = parseInt(result)
    console.log(resultado);

    return { resultado, anio, cuatrimestre};
}

function generarContrasena() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';

    for (let i = 0; i < 8; i++) {
        let randomIndex = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(randomIndex);
    }

    return contrasena;
}


export const autenticado = (req, res) => {
    return res.json('Autenticado')
}

//OBTENER ADMINISTRADOR
export const getAdministrador = (req, res) => {
   
        const sql = 'SELECT * FROM administrador';
        db.query(sql, [req.body.email, req.body.password], (err, data) => {
            if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
            if (data.length > 0) {
                const id = data[0].id;
                const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });
    
                return res.json({ login: true, usuario: data, token: token });
    
            } else {
                return res.json({ login: false, msg: 'Sin registro' })
            }
        })
    
}

//OBTENER ADMINISTRADOR POR ID
export const getAdministradorId = (req, res) => {
        const adminId = req.params.id;
      
        const sql = `SELECT * FROM administrador WHERE id = ${adminId}`;
      
        db.query(sql, [req.body.email, req.body.password], (err, data) => {
            if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
            if (data.length > 0) {
                const id = data[0].id;
                const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });
    
                return res.json({ login: true, usuario: data, token: token });
    
            } else {
                return res.json({ login: false, msg: 'Sin registro' })
            }
        })
}

//CREAR ADMINISTRADOR
export const createAdministrador = (req, res) => {
    const sql = "INSERT INTO administrador (id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, identidad, correo, password ) VALUES (?,?,?,?,?,?,?,?)"
    const {id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, identidad, correo, password} = req.body;
    
    const values = [id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, identidad, correo, password];

    //la funcion que envie cooreo generado, contraseñagenerada, numCuenta
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
}

//Eliminar administrador
export const deleteAdministrador = (req, res) => {
    const adminId = req.params.id;

    const query = `DELETE FROM administrador WHERE id = ${adminId}`;
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error al eliminar el administrador:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el administrador' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ mensaje: 'No se encontró el administrador' });
        } else {
          res.json({ mensaje: 'Administrador eliminado exitosamente' });
        }
      }
    });
}

export const actualizarAdminPorId = (req, res) => {
    const adminId = req.params.id;
    const adminData = req.body; // Se espera que los datos a actualizar se envíen en el cuerpo de la solicitud
  
    const query = `UPDATE administrador SET ? WHERE id = ${adminId}`;
  
    db.query(query, adminData, (error, results) => {
      if (error) {
        console.error('Error al actualizar el administrador:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el administrador' });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ mensaje: 'No se encontró el administrador' });
        } else {
          res.json({ mensaje: 'Administrador actualizado exitosamente' });
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


//ACTUALIZAR ADMINISTRADOR
/*export const updateAdministrador = (req, res) => {
    const { id } = req.params
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, identidad, correo, password } = req.body

        const [result] = db.query('UPDATE administrador SET primer_nombre = IFNULL(?, primer_nombre), segundo_nombre = IFNULL(?, segundo_nombre), primer_apellido = IFNULL(?, primer_apellido), segundo_apellido = IFNULL(?, segundo_apellido), identidad = IFNULL(?, identidad), correo = IFNULL(?, correo), password = IFNULL(?, password) WHERE id = ?', [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, identidad, correo, password,id])

        console.log(result)

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Administrador no encontrado'
    })

    const sql = `SELECT * FROM administrador WHERE id = ${id}`;
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
        if (data.length > 0) {
            const id = data[0].id;
            const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });

            return res.json({ login: true, usuario: data, token: token });

        } else {
            return res.json({ login: false, msg: 'Sin registro' })
        }
})
}*/
/*
        const sql = `SELECT * FROM administrador WHERE id = ${adminId}`;
      
        db.query(sql, [req.body.email, req.body.password], (err, data) => {
            if (err) return res.json("Error") //si nos retorna un error nos mandara como respuesta esto
            if (data.length > 0) {
                const id = data[0].id;
                const token = jwt.sign({ id }, 'grupo3', { expiresIn: 60 });
    
                return res.json({ login: true, usuario: data, token: token });
    
            } else {
                return res.json({ login: false, msg: 'Sin registro' })
            }
        })*/

// Actualizar administrador por ID
