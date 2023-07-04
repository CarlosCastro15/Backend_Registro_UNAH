import {Router} from 'express'
import {getEstudiante,getEstudianteId,deleteEstudiante,updateEstudiante,envioCorreoEstudiante,restaContraEstudiante,actualizarEstuDescri} from '../controllers/estudiante.controlles.js'

const router = Router()

router.get('/estudiante', getEstudiante)

router.get('/estudiante/:num_cuenta', getEstudianteId)

router.delete('/estudiante/:num_cuenta', deleteEstudiante)

router.patch('/estudiante/:num_cuenta', updateEstudiante)

router.post('/forgot-password', envioCorreoEstudiante)

router.post('/reset-password', restaContraEstudiante)

router.post('/estudiantesDescri/descripcion/:num_cuenta', actualizarEstuDescri)

export default router 