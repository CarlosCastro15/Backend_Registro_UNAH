import {Router} from 'express'
import {crearSeccion,eliminarSeccion,seccionporId,actualizarCuposSeccion,seccionesclases,enviarcorreosnotificacion, clasesByIdCarrera, seccionesByIdClase} from '../controllers/seccion.controlles.js'

const router = Router()

router.post('/crearproceso', crearSeccion)

router.delete('/eliminarseccion/:id', eliminarSeccion)

router.get('/buscarseccion/:id_clase/:num_empleado',seccionporId)

router.post('/actucupos/cupos/:id_seccion', actualizarCuposSeccion)

//Obtener las secciones con clases deacuerdo al ID de la seccion  //Fernando
router.get('/consulta-secciones/:carreraId/:centroId/:anio/:periodo',seccionesclases)

router.get('/enviar-correos-notificacion/:id_seccion', enviarcorreosnotificacion)

//AÑADIDO
// Endpoint para obtener todas las clases de una carrera
router.get('/clasesDisponibles/:id_carrera', clasesByIdCarrera )
  
  // Endpoint para obtener todas las secciones de una clase
router.get('/seccionesDisponibles/:id_clase', seccionesByIdClase) 

export default router 