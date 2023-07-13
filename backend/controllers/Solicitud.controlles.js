import {db} from '../db.js'
import jwt from'jsonwebtoken'
import nodemailer from'nodemailer'



  export const CrearSolicitud = (req, res) => {
    console.log("hola solicitudes")
    const estado = 'Pendiente';
    const sql = `INSERT INTO solicitud (tipo_solicitud, num_cuenta, num_empleado, justificacion, estado) 
    //VALUES (?, ?, ?, ?, ?)`;
    const {tipo_solicitud,num_cuenta,num_empleado,justificacion} = req.body;

    const values = [tipo_solicitud,num_cuenta,num_empleado,
    justificacion,estado];

  
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(values);
    })
}