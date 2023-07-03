import {Router} from 'express'
import {carrerasCentro,docenteCarreraCentro,actualizarCargoDocente} from '../controllers/docente.controlles.js'

const router = Router()


//router.get('/docente/:columna/:valor', docentePorCarrera)

router.get('/carreras/:centro_id',carrerasCentro)

//router.get('/docente/:nombre/:nombre',docenteCarrera)
router.get('/docente/:carrera/:centro', docenteCarreraCentro)

router.put('/docentes/:cargo/:num_empleado', actualizarCargoDocente)


export default router 