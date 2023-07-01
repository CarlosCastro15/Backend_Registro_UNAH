import {Router} from 'express'
import {enviarCorreosEstudiantes} from '../helpers/envioCorreos.js'

const router = Router()

router.get('/enviar-correo',enviarCorreosEstudiantes)

export default router 