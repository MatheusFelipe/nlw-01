import { Request, Response } from 'express';

import knex from '../database/connection';
import serializeImage from '../utils/serializeImage';

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points as p')
      .distinct('p.*')
      .join('points_items as pi', { 'p.id': 'pi.point_id' })
      .whereIn('pi.item_id', parsedItems)
      .where({ 'p.city': String(city), 'p.uf': String(uf) });
    return res.json(points.map(point => ({ ...point, image_url: serializeImage(point.image) })));
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex('points').where({ id }).first();
    if (!point) return res.status(400).json({ message: 'POINT_NOT_FOUND' });
    const items = await knex('items as i')
      .select('i.title')
      .join('points_items as pi', { 'i.id': 'pi.item_id' })
      .where({ 'pi.point_id': id });
    return res.json({ point: { ...point, image_url: serializeImage(point.image) }, items });
  }

  async create(req: Request, res: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body;
    const point = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const trx = await knex.transaction();
    const [point_id] = await trx('points').insert(point);
    const pointsItemsIds = await trx('points_items').insert(
      items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => ({ item_id, point_id }))
    );
    await trx.commit();
    return res.json({ id: point_id, ...point, pointsItemsIds });
  }
}

export default PointsController;
