import {Router} from 'express'
import {getEstudiante,getEstudianteId,deleteEstudiante,updateEstudiante} from '../controllers/estudiante.controlles.js'

const router = Router()

router.get('/estudiante', getEstudiante)

router.get('/estudiante/:num_cuenta', getEstudianteId)

router.delete('/estudiante/:num_cuenta', deleteEstudiante)

router.patch('/estudiante/:num_cuenta', updateEstudiante)

export default router 