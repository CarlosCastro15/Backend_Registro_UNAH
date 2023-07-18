import express from'express'
import cors from 'cors'
import jwt from'jsonwebtoken';
import administradorRoutes from './routes/administrador.routes.js'
import estudianteRoutes from './routes/estudiante.routes.js'
import imagesRoutes from './routes/images.routes.js'
import videosRoutes from './routes/videos.routes.js'
import docenteRoutes from './routes/docente.routes.js'
import claseRoutes from './routes/clase.routes.js'
import edificioRoutes from './routes/edificio.routes.js'
import seccionRoutes from './routes/seccion.routes.js'
import solicitudRoutes from './routes/Solicitude.router.js'
import procesoRoutes from './routes/procesos.routes.js'
import procesoSubirNotas from './routes/proceso_subir_notas.routes.js'
import path  from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(imagesRoutes) 
app.use(videosRoutes)
app.use(administradorRoutes)
app.use(estudianteRoutes)
app.use(docenteRoutes)
app.use(claseRoutes)
app.use(edificioRoutes)
app.use(seccionRoutes)
app.use(solicitudRoutes)
app.use(procesoRoutes)
app.use(procesoSubirNotas)
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'uploadss')))


// const generarCorreo = (nombre, apellido) => {
//     var correo = nombre.toLowerCase() + "." + apellido.toLowerCase() + "@unah.hn";
//     return correo;
// }
app.listen(8081, () => {
    console.log('Listening...');
})




