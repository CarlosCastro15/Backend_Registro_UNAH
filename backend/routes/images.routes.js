import {Router} from 'express'
import {cargarimagen} from '../controllers/images.controlles.js'
import { verifyJwt } from '../helpers/verifyJwt.js'
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Carpeta donde se guardarán las fotos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });
const router = Router()

// ENDPOINT: cargar imagen
router.post('/cargarimagen',upload.single('foto'), cargarimagen )

export default router 