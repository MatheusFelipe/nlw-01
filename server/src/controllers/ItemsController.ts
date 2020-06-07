import { Request, Response } from 'express';

import knex from '../database/connection';
import serializeImage from '../utils/serializeImage';

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      image_url: serializeImage(item.image),
    }));
    return res.json(serializedItems);
  }
}

export default ItemsController;
