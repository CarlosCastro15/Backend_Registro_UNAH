import {Router} from 'express'
import {creardocente,sesionadministrador,sesiondocente,sesionestudiante,registroCSV,autenticado,getAdministrador,getAdministradorId,createAdministrador,deleteAdministrador,actualizarAdminPorId} from '../controllers/administrador.controlles.js'
import { verifyJwt } from '../helpers/verifyJwt.js'
import multer from 'multer'

const upload = multer({ dest: 'csv/' });
const router = Router()

// ENDPOINT: CREAR UN DOCENTE
router.post('/crear/docente', creardocente )

// ENDPOINT: INICIO DE SESION DE ADMINISTRADOR
router.post('/login/administrador', sesionadministrador)

// ENDPOINT: INICIO DE SESION DE DOCENTE
router.post('/login/docente', sesiondocente)

// ENDPOINT: INICIO DE SESION DE ESTUDIANTE
router.post('/login/estudiante', sesionestudiante)

// ENDPOINT: REGISTRAR ESTUDIANTES DESDE UN CSV
// Manejar la carga de archivos
//app.post('/upload', upload.single('csvFile'), registroCSV);
router.post('/registro/estudiante',upload.single('csvFile'), registroCSV);

router.get('/checktauth', verifyJwt, autenticado)

router.get('/administrador', getAdministrador)

router.get('/administrador/:id', getAdministradorId)

router.post('/administrador', createAdministrador)

router.delete('/administrador/:id', deleteAdministrador)

router.patch('/administrador/:id', actualizarAdminPorId)

export default router 