import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin.middleware';
import { upload } from '../middlewares/upload';
import cloudinary from '../lib/cloudinary';

const router = Router();

router.post(
  '/',
  authMiddleware,
  isAdmin,
  upload.single('imagen'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
      }

      const url = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'moda-store/productos',
              transformation: [
                { width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error || !result) return reject(error ?? new Error('Sin resultado de Cloudinary'));
              resolve(result.secure_url);
            }
          )
          .end(req.file!.buffer);
      });

      res.json({ url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al subir imagen a Cloudinary' });
    }
  }
);

export default router;
