import {Router} from 'express'
import {getEstudiante,
    getEstudianteId,
    deleteEstudiante,
    updateEstudiante,
    envioCorreoEstudiante
    ,restaContraEstudiante,
    actualizarEstuDescri,
    notaEstudiante,clasesByIdEstudiante
    ,verificarRequisito,verificarHorario,
    matriculaSeccion,eliminarClase, clases_matriculadas
    ,clasesAlumno,insertarclasepasada,estudianteSeccionObtener,
    clases_historial} from '../controllers/estudiante.controlles.js'

const router = Router()

router.get('/estudiante', getEstudiante)

router.get('/estudiante/:num_cuenta', getEstudianteId)

router.delete('/estudiante/:num_cuenta', deleteEstudiante)

router.patch('/estudiante/:num_cuenta', updateEstudiante)

router.post('/forgot-password', envioCorreoEstudiante)

router.post('/reset-password', restaContraEstudiante)

router.post('/estudiantesDescri/descripcion/:num_cuenta', actualizarEstuDescri)

//listar los alumnos segun el id de la clase Roberto //acordate
router.get('/claseAlumno/:id_clase', clasesAlumno)
//router.get('/clase-Alumno/:id_seccion',  claseAlumnoidseccion)

//listar los alumnos segun el id de la clase ROBERTO
router.get('/estudiantes-seccion/:idSeccion', estudianteSeccionObtener)

//PREGUNTAR A ROBERTO
router.post('/insertar-nota-clasepasada', insertarclasepasada)

//editar nota del estudiante segun num_cuenta en la tabla clases_pasadas Roberto
router.put('/clase-pasada-nota/:id_clase/:id_estudiante', notaEstudiante)

//-------------
//OBTENER CLASESFALTANTES POR MEDIO DEL ID DEL ESTUDIANTE
router.get('/clasesFaltantesEstudiante/:num_cuenta', clasesByIdEstudiante)

router.get('/verificar-requisitos/:idClase', verificarRequisito)

router.get('/verificar-horario/:idSeccion/:num_cuenta/:anio/:periodo', verificarHorario)

router.post('/insertMatricula', matriculaSeccion);

router.delete('/eliminar-clase/:num_cuenta/:id_seccion', eliminarClase )

router.get('/clases-matriculadas/:num_cuenta/:anio/:periodo',clases_matriculadas)
router.get('/clases-historial/:num_cuenta',clases_historial)

export default router 