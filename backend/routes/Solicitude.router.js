import {Router} from 'express'
import {crearSolicitud,
    obtenerSolicitudesPorCoordinador,ActualizarEstado,obtenerSolicitudEs,Centro,PagoReposicionEstudiante } from '../controllers/Solicitud.controlles.js'

const router = Router()
router.post('/Crear_Solicitud', crearSolicitud)
router.get('/Solicitudes_Coordinador', obtenerSolicitudesPorCoordinador)
router.put('/ActualizarEstado/:id', ActualizarEstado)
router.get('/VerSolicitud', obtenerSolicitudEs)
router.get('/VerCentros', Centro)
router.get('/PagoReposicion/:num_cuenta', PagoReposicionEstudiante )
export default router 