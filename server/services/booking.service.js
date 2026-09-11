import { getModels } from '../models/index.js';
import { makeId } from './jsonStore.service.js';
import { createNotification } from './notification.service.js';
import { isBlocked } from './availability.service.js';

export const allBookings = async ({ page = 1, limit = 10 } = {}) => {
  const result = await getModels().Booking.findAndCountAll({ order: [['createdAt', 'DESC']], limit, offset: (page - 1) * limit });
  return { rows: result.rows, count: result.count };
};
export const createBooking = async (data) => {
  if (await isBlocked(data.date)) { const error = new Error('This date is currently unavailable.'); error.status = 409; throw error; }
  const now = new Date();
  const booking = await getModels().Booking.create({ id: makeId(), ...data, status: 'new', createdAt: now, updatedAt: now });
  await createNotification({ type: 'booking.created', bookingId: booking.id, title: 'New booking enquiry', message: `${booking.name} requested a ${booking.eventType} appointment for ${booking.date}.` });
  return booking;
};
export const updateBooking = async (id, data) => {
  const Booking = getModels().Booking;
  const booking = await Booking.findByPk(id);
  if (!booking) { const error = new Error('Booking not found'); error.status = 404; throw error; }
  const previousStatus = booking.status;
  await booking.update({ ...data, updatedAt: new Date() });
  if (data.status && data.status !== previousStatus) await createNotification({ type: 'booking.updated', bookingId: id, title: 'Booking status updated', message: `${booking.name} is now marked ${booking.status}.` });
  return booking;
};
export const removeBooking = async (id) => {
  const booking = await getModels().Booking.findByPk(id);
  if (!booking) { const error = new Error('Booking not found'); error.status = 404; throw error; }
  await booking.destroy();
};
