import {Router} from 'express'
import {carrerasCentro,docenteCarreraCentro,actualizarCargoDocente,envioCorreoDocente,restaContraDocente} from '../controllers/docente.controlles.js'

const router = Router()


//router.get('/docente/:columna/:valor', docentePorCarrera)

router.get('/carreras/:centro_id',carrerasCentro)

//router.get('/docente/:nombre/:nombre',docenteCarrera)
router.get('/docente/:carrera/:centro', docenteCarreraCentro)

router.put('/docentes/:cargo/:num_empleado', actualizarCargoDocente)

router.post('/forgot-password-docente', envioCorreoDocente)

router.post('/reset-password-docente', restaContraDocente)


export default router 