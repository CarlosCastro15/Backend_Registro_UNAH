import { Router } from 'express';
import { cargarvideo, obtenerVideo,eliminarVideo } from '../controllers/videos.controlles.js';
import multer from 'multer';
import mime from 'mime-types';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  },
  fileFilter: function (req, file, cb) {
    const allowedExtensions = ['mp4', 'avi', 'mkv', 'mov'];
    const mimeType = mime.lookup(file.originalname);

    if (mimeType && allowedExtensions.includes(mime.extension(mimeType))) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido.'));
    }
  }
});

const upload = multer({ storage: storage });
const router = Router();

router.post('/cargarvideo', upload.single('video'), cargarvideo);
router.get('/obtenerVideo', obtenerVideo);
router.delete('/eliminarVideo', eliminarVideo)
export default router;