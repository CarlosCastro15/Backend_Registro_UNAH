import {Router} from 'express'
import {subirDiscponibilidad,actualizarDisponibilidad} from '..//controllers/proceso_subir_notas.controlles.js'

const router = Router()

//endpoint para traer los procesos de subir nota que la disponibilidad sea TRUE  //ROBERTO
router.get('/proceso_subir_notas_disponibilidad', subirDiscponibilidad)

//endpoint para actualizar la disponibilidad en la tabla proceso_subir_notas //ROBERTO
router.put('/proceso-subir-notas-actualizar/:id', actualizarDisponibilidad)


export default router 