import {Router} from 'express'
import {carrerasCentro,docenteCarreraCentro,actualizarCargoDocente,envioCorreoDocente,restaContraDocente,docenteCarreraCentroById, getDocenteById,clasesDocente,docentecarreranombre, centroById} from '../controllers/docente.controlles.js'

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

//docente por medio de carrera  //DAVID
router.get('/docentecarreranombre/:nombre/:centro', docentecarreranombre)


export default router 