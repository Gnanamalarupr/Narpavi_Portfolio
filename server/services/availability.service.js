import { getModels } from '../models/index.js';

export const listAvailability = () => getModels().Availability.findAll({ order: [['date', 'ASC']] });
export const setAvailability = async (date, status, note = '') => {
  const Availability = getModels().Availability;
  const [item] = await Availability.upsert({ date, status, note });
  return item;
};
export const removeAvailability = async (date) => {
  const item = await getModels().Availability.findByPk(date);
  if (!item) { const error = new Error('Availability date not found'); error.status = 404; throw error; }
  await item.destroy();
};
export const isBlocked = async (date) => {
  const item = await getModels().Availability.findByPk(date);
  return item?.status === 'blocked';
};
