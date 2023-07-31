import {Router} from 'express'
import {crearSolicitud,
    obtenerSolicitudesPorCoordinador,
    ActualizarEstado,
    obtenerSolicitudEs,
    Centro,
    PagoReposicionEstudiante }
     from '../controllers/Solicitud.controlles.js'
     import multer from 'multer';
 
     const storage = multer.diskStorage({
         destination: function (req, file, cb) {
           cb(null, 'uploads/'); // Carpeta donde se guardarán las fotos
         },
         filename: function (req, file, cb) {
           cb(null, file.originalname);
         }
       });
       const upload = multer({ storage: storage });
     
const router = Router()
router.post('/Crear_Solicitud',upload.single('Documento'), crearSolicitud)
router.get('/Solicitudes_Coordinador', obtenerSolicitudesPorCoordinador)
router.put('/ActualizarEstado/:id', ActualizarEstado)
router.get('/VerSolicitud', obtenerSolicitudEs)
router.get('/VerCentros', Centro)
router.get('/PagoReposicion/:num_cuenta', PagoReposicionEstudiante )
export default router 