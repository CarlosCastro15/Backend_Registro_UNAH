import {Router} from 'express'
import {crearSeccion,eliminarSeccion,seccionporId,actualizarCuposSeccion} from '../controllers/seccion.controlles.js'

const router = Router()

router.post('/crearproceso', crearSeccion)

router.delete('/eliminarseccion/:id', eliminarSeccion)

router.get('/buscarseccion/:id_clase/:num_empleado',seccionporId)

router.post('/actucupos/cupos/:id_seccion', actualizarCuposSeccion)


export default router 