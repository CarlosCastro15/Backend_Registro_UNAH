import {Router} from 'express'
import {clasesCarrera,clasesNoPasadas,edificioAula} from '../controllers/clase.controlles.js'

const router = Router()

//clases por medio del nombre de la carrera DAVID
router.get('/clasescarrera/:nombre', clasesCarrera)

//te trae las clases del estudiante que todavia no ha pasado //DAVID
router.get('/clasesnopasadas/:num_cuenta',clasesNoPasadas)

router.get('/consulta-aula', edificioAula)



export default router 