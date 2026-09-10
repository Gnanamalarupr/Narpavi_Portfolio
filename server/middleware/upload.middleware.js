import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');
const storage = multer.diskStorage({ destination: uploadDir, filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`) });
const fileFilter = (_, file, cb) => cb(null, file.mimetype.startsWith('image/'));
export const uploadImage = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('imageFile');
