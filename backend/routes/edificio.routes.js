import {Router} from 'express'
import {EdificioID,aulasDisponibles,proceso,ingresarProceso,eliminarProceso} from '../controllers/edificio.controlles.js'

const router = Router()

//traer todos los edificios todos los edificios  //DAVID 
router.get('/edificio', EdificioID)

//traer aulas disponibles //DAVID
router.get('/aulas-disponibles', aulasDisponibles) 

//traer el proceso de matricula //DAVID
router.get('/proceso', proceso)

//ingresar el proceso de matricula //DAVID
router.post('/insertarproceso', ingresarProceso)

//eliminar el proceso de matricula //DAVID
router.delete('/proceso/:id', eliminarProceso)







export default router 