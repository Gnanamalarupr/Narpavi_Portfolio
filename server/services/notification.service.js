import { getModels } from '../models/index.js';
import { makeId } from './jsonStore.service.js';

export const allNotifications = async ({ page = 1, limit = 10 } = {}) => {
  const result = await getModels().Notification.findAndCountAll({ order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit });
  return { rows: result.rows, count: result.count };
};
export const createNotification = (data) => getModels().Notification.create({ id: makeId(), read: false, createdAt: new Date(), ...data });
export const markNotificationRead = async (id) => {
  const notification = await getModels().Notification.findByPk(id);
  if (!notification) { const error = new Error('Notification not found'); error.status = 404; throw error; }
  await notification.update({ read: true });
  return notification;
};
