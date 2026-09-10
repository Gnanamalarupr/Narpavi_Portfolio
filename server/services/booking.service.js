import { readCollection, writeCollection, makeId } from './jsonStore.service.js';
import { createNotification } from './notification.service.js';
const file = 'bookings.json';
export const allBookings = () => readCollection(file);
export const createBooking = async (data) => {
	const all = await readCollection(file);
	const booking = { id: makeId(), ...data, status: 'new', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
	all.unshift(booking);
	await writeCollection(file, all);
	await createNotification({ type: 'booking.created', bookingId: booking.id, title: 'New booking enquiry', message: `${booking.name} requested a ${booking.eventType} appointment for ${booking.date}.` });
	return booking;
};
export const updateBooking = async (id, data) => {
	const all = await readCollection(file);
	const index = all.findIndex((booking) => booking.id === id);
	if (index < 0) { const error = new Error('Booking not found'); error.status = 404; throw error; }
	const previous = all[index];
	const booking = { ...previous, ...data, id, updatedAt: new Date().toISOString() };
	all[index] = booking;
	await writeCollection(file, all);
	if (data.status && data.status !== previous.status) await createNotification({ type: 'booking.updated', bookingId: id, title: 'Booking status updated', message: `${booking.name} is now marked ${booking.status}.` });
	return booking;
};
export const removeBooking = async (id) => {
	const all = await readCollection(file);
	const next = all.filter((booking) => booking.id !== id);
	if (next.length === all.length) { const error = new Error('Booking not found'); error.status = 404; throw error; }
	await writeCollection(file, next);
};
