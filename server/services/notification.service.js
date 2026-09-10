import { readCollection, writeCollection, makeId } from './jsonStore.service.js';

const file = 'notifications.json';

export const allNotifications = () => readCollection(file);
export const createNotification = async (data) => {
  const all = await readCollection(file);
  const notification = { id: makeId(), read: false, createdAt: new Date().toISOString(), ...data };
  all.unshift(notification);
  await writeCollection(file, all);
  return notification;
};
export const markNotificationRead = async (id) => {
  const all = await readCollection(file);
  const notification = all.find((item) => item.id === id);
  if (!notification) {
    const error = new Error('Notification not found');
    error.status = 404;
    throw error;
  }
  notification.read = true;
  await writeCollection(file, all);
  return notification;
};
