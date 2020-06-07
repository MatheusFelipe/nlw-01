import multer from 'multer';
import Path from 'path';
import { randomBytes } from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: Path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, callback) => {
      if (!file) return callback(new Error('FILE_NOT_FOUND'), '');
      const hash = randomBytes(6).toString('hex');
      const fileName = `${hash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
