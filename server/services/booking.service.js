import { getModels } from '../models/index.js';
import { makeId } from './jsonStore.service.js';
import { createNotification } from './notification.service.js';

export const allBookings = () => getModels().Booking.findAll({ order: [['createdAt', 'DESC']] });
export const createBooking = async (data) => {
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
