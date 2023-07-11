import {Router} from 'express'
import {EdificioID,aulasDisponibles} from '../controllers/edificio.controlles.js'

const router = Router()

//traer todos los edificios todos los edificios  //DAVID 
router.get('/edificio', EdificioID)

//traer aulas disponibles //DAVID
router.get('/aulas-disponibles', aulasDisponibles) 

export default router 