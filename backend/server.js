import express from'express'
import cors from 'cors'
import jwt from'jsonwebtoken';
import administradorRoutes from './routes/administrador.routes.js'
import estudianteRoutes from './routes/estudiante.routes.js'
import imagesRoutes from './routes/images.routes.js'

import mysql from 'mysql2';


const app = express();
app.use(cors());
app.use(express.json());

app.use(imagesRoutes) 
app.use(administradorRoutes)
app.use(estudianteRoutes)



// const generarCorreo = (nombre, apellido) => {
//     var correo = nombre.toLowerCase() + "." + apellido.toLowerCase() + "@unah.hn";
//     return correo;
// }
app.listen(8081, () => {
    console.log('Listening...');
})

