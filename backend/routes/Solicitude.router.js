import {Router} from 'express'
import {crearSolicitud,
    obtenerSolicitudesPorCoordinador,ActualizarEstado} from '../controllers/Solicitud.controlles.js'
const router = Router()
router.post('/Crear_Solicitud', crearSolicitud)
router.get('/Solicitudes_Coordinador', obtenerSolicitudesPorCoordinador)
router.put('/ActualizarEstado/:id', ActualizarEstado)
export default router 