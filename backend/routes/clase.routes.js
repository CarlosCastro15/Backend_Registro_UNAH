import {Router} from 'express'
import {clasesCarrera} from '../controllers/clase.controlles.js'

const router = Router()

//clases por medio del nombre de la carrera DAVID
router.get('/clasescarrera/:nombre', clasesCarrera)



export default router 