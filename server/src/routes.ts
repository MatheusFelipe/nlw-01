import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';
import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post(
  '/points',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        uf: Joi.string().required().max(2),
        city: Joi.string().required(),
        items: Joi.string()
          .required()
          .regex(/\d(,\d)*/),
      }),
    },
    { abortEarly: false }
  ),
  pointsController.create
);

export default routes;
