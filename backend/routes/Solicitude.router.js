import {Router} from 'express'
import {CrearSolicitud} from '../controllers/Solicitud.controlles.js'
const router = Router()
router.post('/Crear_Solicitud', CrearSolicitud)
export default router 