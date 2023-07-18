import {Router} from 'express'
import {getEstudiante,getEstudianteId,deleteEstudiante,updateEstudiante,envioCorreoEstudiante,restaContraEstudiante,actualizarEstuDescri,clasesAlumno,notaEstudiante} from '../controllers/estudiante.controlles.js'

const router = Router()

router.get('/estudiante', getEstudiante)

router.get('/estudiante/:num_cuenta', getEstudianteId)

router.delete('/estudiante/:num_cuenta', deleteEstudiante)

router.patch('/estudiante/:num_cuenta', updateEstudiante)

router.post('/forgot-password', envioCorreoEstudiante)

router.post('/reset-password', restaContraEstudiante)

router.post('/estudiantesDescri/descripcion/:num_cuenta', actualizarEstuDescri)

//listar los alumnos segun el id de la clase Roberto
router.get('/claseAlumno/:id_clase', clasesAlumno)

//editar nota del estudiante segun num_cuenta en la tabla clases_pasadas Roberto
router.put('/clase-pasada-nota/:id_clase/:id_estudiante', notaEstudiante)

export default router 