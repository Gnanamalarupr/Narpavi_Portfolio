import { getModels } from '../models/index.js';
import { makeId } from './jsonStore.service.js';

export const approvedReviews = () => getModels().Review.findAll({ where: { status: 'approved' }, order: [['createdAt', 'DESC']] });
export const pendingReviews = () => getModels().Review.findAll({ where: { status: 'pending' }, order: [['createdAt', 'DESC']] });
export const createReview = (data) => getModels().Review.create({ id: makeId(), ...data, rating: Number(data.rating), status: 'pending', createdAt: new Date() });
export const setReviewStatus = async (id, status) => {
  const review = await getModels().Review.findByPk(id);
  if (!review) { const error = new Error('Review not found'); error.status = 404; throw error; }
  await review.update({ status });
  return review;
};
