import {Router} from 'express'
import {docentePorCarrera,carrerasCentro,docenteCarrera,actualizarCargoDocente} from '../controllers/docente.controlles.js'

const router = Router()


router.get('/docente/:columna/:valor', docentePorCarrera)

router.get('/carreras/:centro_id',carrerasCentro)

router.get('/docente/:nombre',docenteCarrera)

router.put('/docentes/cargo/:num_empleado', actualizarCargoDocente)


export default router 