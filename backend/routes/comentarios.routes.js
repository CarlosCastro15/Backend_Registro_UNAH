import {Router} from 'express'
import {insertarComentarios,clasesPeiodoEstudiante,anioperiodo,anioperiodomatricula} from '../controllers/comentarios.controlles.js'

const router = Router()

//Insertar los comentarios de evaluacion que se le hacen al docente y actualizar en la tabla evaluar_docente //ROBERTO
router.post('/comentarios-insertar', insertarComentarios)

//Traiga las clases que lleva en el periodo mediante el id del estudiante y el id del periodo //ROBERTO
router.get('/consulta-clases/:idEstudiante/:anio/:periodo',clasesPeiodoEstudiante)

//proceso para que obtenga anio y periodo //ROBERTO
router.get('/proceso-anio-periodo', anioperiodo);

router.get('/proceso-anio-periodo-come', anioperiodomatricula);

export default router 