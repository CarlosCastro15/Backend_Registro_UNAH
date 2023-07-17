import {Router} from 'express'
import {crearSeccion,eliminarSeccion,seccionporId,actualizarCuposSeccion,seccionesclases} from '../controllers/seccion.controlles.js'

const router = Router()

router.post('/crearproceso', crearSeccion)

router.delete('/eliminarseccion/:id', eliminarSeccion)

router.get('/buscarseccion/:id_clase/:num_empleado',seccionporId)

router.post('/actucupos/cupos/:id_seccion', actualizarCuposSeccion)

//Obtener las secciones con clases deacuerdo al ID de la seccion  //Fernando
router.get('/seccionesclases/:centroId/:carreraId',seccionesclases)


export default router 