import { Router, type Request, type Response } from 'express';
import type { Writable } from 'node:stream';
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
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
      }

      const url = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
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
        ) as unknown as Writable;

        stream.end(req.file!.buffer);
      });

      res.json({ url });
    } catch (error) {
      process.stderr.write(String(error) + '\n');
      res.status(500).json({ error: 'Error al subir imagen a Cloudinary' });
    }
  }
);

export default router;
