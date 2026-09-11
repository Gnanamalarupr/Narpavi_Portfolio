import { getModels } from '../models/index.js';
import { makeId } from './jsonStore.service.js';

export const allNotifications = () => getModels().Notification.findAll({ order: [['createdAt', 'DESC']] });
export const createNotification = (data) => getModels().Notification.create({ id: makeId(), read: false, createdAt: new Date(), ...data });
export const markNotificationRead = async (id) => {
  const notification = await getModels().Notification.findByPk(id);
  if (!notification) { const error = new Error('Notification not found'); error.status = 404; throw error; }
  await notification.update({ read: true });
  return notification;
};
