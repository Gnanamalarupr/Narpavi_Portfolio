import { readCollection, writeCollection, makeId } from './jsonStore.service.js';
const file = 'reviews.json';
export const approvedReviews = async () => (await readCollection(file)).filter(r => r.status === 'approved');
export const pendingReviews = async () => (await readCollection(file)).filter(r => r.status === 'pending');
export const createReview = async (data) => { const all = await readCollection(file); const review = { id: makeId(), ...data, rating: Number(data.rating), status: 'pending', createdAt: new Date().toISOString() }; all.unshift(review); await writeCollection(file, all); return review; };
export const setReviewStatus = async (id, status) => { const all = await readCollection(file); const review = all.find(r => r.id === id); if (!review) { const error = new Error('Review not found'); error.status = 404; throw error; } review.status = status; await writeCollection(file, all); return review; };
