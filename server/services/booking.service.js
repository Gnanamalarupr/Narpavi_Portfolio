import { readCollection, writeCollection, makeId } from './jsonStore.service.js';
const file = 'bookings.json';
export const allBookings = () => readCollection(file);
export const createBooking = async (data) => { const all = await readCollection(file); const booking = { id: makeId(), ...data, status: 'new', createdAt: new Date().toISOString() }; all.unshift(booking); await writeCollection(file, all); return booking; };
