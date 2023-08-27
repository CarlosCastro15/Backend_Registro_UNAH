import {Router} from 'express'
import {getEstudiante,
    getEstudianteId,
    deleteEstudiante,
    updateEstudiante,
    envioCorreoEstudiante
    ,restaContraEstudiante,
    actualizarEstuDescri,
    notaEstudiante,clasesByIdEstudiante
    ,eliminarClase, clases_matriculadas
    ,clasesAlumno,insertarclasepasada,estudianteSeccionObtener,
    clases_historial,enviarCorreoNumCuenta, traerDeptosByIdCarrera, ObtenerClasesFaltantesByIdEstudiante, verificarRequisito, VerificaClasePorIdEst, SeccionesPorClase, verificarHorario, matriculaSeccion, getCarreraEstudianteById} from '../controllers/estudiante.controlles.js'

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







router.delete('/eliminar-clase/:num_cuenta/:id_seccion', eliminarClase )

router.get('/clases-matriculadas/:num_cuenta/:anio/:periodo',clases_matriculadas)
router.get('/clases-historial/:num_cuenta',clases_historial)


router.get('/enviar-correo-solicitud/:numCuenta', enviarCorreoNumCuenta)

//desde aqui proceso de matricula
//TRAE TODOS LOS DEPARTAMENTOS DE LA CARRERA A LOS QUE EL ESTUDIANTE PERTENECE 
router.get('/obtenerDeptos', traerDeptosByIdCarrera)

//TRAE LAS CLASES QUE LE FALTAN AL ESTUDIANTE ENVIANDO EL ID DEL DEPTO Y EL NUM_CUENTA DEL ESTUDDIANTE
router.get('/clasesFaltantes', ObtenerClasesFaltantesByIdEstudiante)

//VERIFICAR REQUISITO DE SI PUEDE O NO MATRICULAR LA CLASE
router.get('/verificar-requisitos', verificarRequisito)

//VERIFICA SI TIENE ESA CLASE MATRICULADA YA
//SI NO LA TIENE MATRICULADA RETORNA FALSE Y SI SI LA TIENE TRUE
router.get('/verifica-clase', VerificaClasePorIdEst)

//TRAE LAS SECCIONES DISPONIBLES DE ESA CLASE EN ESPECIFICO
router.get('/secciones-por-clase', SeccionesPorClase)

//VERIFICA QUE EL ESTUDIANTE NO TENGA CLASES MATRICULADAS A ESA HORA DE LA SECCION
router.get('/verificar-horario', verificarHorario)

//MATRICULA EL ESTUDIANTE EN UNA SECCION
router.post('/insertMatricula', matriculaSeccion);


//OBTENER EL ID DE LA CARRERA POR MEDIO DEL ID DEL ESTUDIANTE
router.get('/carreraDeEstudiante', getCarreraEstudianteById);


export default router 

