import { getModels } from '../models/index.js';
import { makeId } from './jsonStore.service.js';

const modelFor = (file) => file === 'portfolio.json' ? getModels().PortfolioItem : getModels().Service;
const plain = (item) => item.toJSON();
export const list = async (file) => (await modelFor(file).findAll()).map(plain);
export const create = async (file, data) => plain(await modelFor(file).create({ id: makeId(), ...data }));
export const update = async (file, id, data) => {
  const item = await modelFor(file).findByPk(id);
  if (!item) { const error = new Error('Item not found'); error.status = 404; throw error; }
  await item.update({ ...data, id });
  return plain(item);
};
export const remove = async (file, id) => {
  const item = await modelFor(file).findByPk(id);
  if (!item) { const error = new Error('Item not found'); error.status = 404; throw error; }
  await item.destroy();
};
