import {Router} from 'express'
import {carrerasCentro,
    docenteCarreraCentro,
    actualizarCargoDocente,
    envioCorreoDocente,
    restaContraDocente,
    docenteCarreraCentroById,
     getDocenteById,
     clasesDocente,
     docentecarreranombre, 
     centroById, 
     getDocenteByCorreo,
      getHistorialByNumCuenta,
      getEvaluciones,clasesDocenteID} from '../controllers/docente.controlles.js'

const router = Router()


//router.get('/docente/:columna/:valor', docentePorCarrera)

router.get('/carreras/:centro_id',carrerasCentro)

//Obtener centro by ID del docente-----------
router.get('/carrerById/:centro_id',centroById)

//router.get('/docente/:nombre/:nombre',docenteCarrera)
router.get('/docente/:carrera/:centro', docenteCarreraCentro)

router.put('/docentes/:cargo/:num_empleado', actualizarCargoDocente)

router.post('/forgot-password-docente', envioCorreoDocente)

router.post('/reset-password-docente', restaContraDocente)

router.get('/docentes/:carrera/:centro', docenteCarreraCentroById)

router.get('/docente/:id', getDocenteById)

////clases segun id del docente //Roberto
router.get('/clasesdocentes/:num_empleado', clasesDocente)
router.get('/clasesdocentes/:num_empleado/:id_seccion', clasesDocenteID)

//docente por medio de carrera  //DAVID
router.get('/docentecarreranombre/:nombre/:centro', docentecarreranombre)

router.get('/docenteCorreo/:correo', getDocenteByCorreo)

//AÑADIDO 26/7/23

router.get('/historialEstudiante/:numCuenta', getHistorialByNumCuenta)

router.get('/Evaluaciones/:num_empleado/:anio/:periodo', getEvaluciones)


export default router 