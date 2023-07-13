import {Router} from 'express'
import {crearSolicitud,
    obtenerSolicitudesPorCoordinador} from '../controllers/Solicitud.controlles.js'
const router = Router()
router.post('/Crear_Solicitud', crearSolicitud)
router.get('/Solicitudes_Coordinador', obtenerSolicitudesPorCoordinador)
export default router 