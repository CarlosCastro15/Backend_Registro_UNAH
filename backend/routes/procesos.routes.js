import {Router} from 'express'
import {procespDisponibilidad,actualizarDisponibilidadProceso, actualizarDisponibilidadProcesoCarga, procesoCargaDisponibilidad} from '..//controllers/proceso.controlles.js'

const router = Router()

//endpoint para traer los procesos de subir nota que la disponibilidad sea TRUE  //DAVID
router.get('/proceso_disponibilidad', procespDisponibilidad)

//endpoint para actualizar la disponibilidad en la tabla proceso_subir_notas //DAVID
router.put('/proceso-actualizar/:id', actualizarDisponibilidadProceso)

router.put('/procesoCarga-actualizar/:id', actualizarDisponibilidadProcesoCarga)

router.get('/procesoCarga_disponibilidad', procesoCargaDisponibilidad)

export default router 