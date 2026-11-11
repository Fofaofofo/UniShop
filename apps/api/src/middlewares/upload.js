import multer from 'multer';
import { HttpError } from '../lib/utils.js';

const MB = 1024 * 1024;

// Imagem de produto: estritamente < 1MB
export const uploadImagem = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MB - 1, files: 1 },
  fileFilter: (_req, file, cb) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(400, 'A imagem deve ser JPG, PNG ou WebP.')),
}).single('imagem');

// Comprovativo de pagamento: imagem ou PDF até 3MB
export const uploadComprovativo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * MB, files: 1 },
  fileFilter: (_req, file, cb) =>
    ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(400, 'O comprovativo deve ser imagem ou PDF.')),
}).single('comprovativo');
