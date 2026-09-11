import rateLimit from 'express-rate-limit';

const writeLimit = (message) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message }
});

export const bookingWriteLimit = writeLimit('Too many booking enquiries. Please try again later.');
export const reviewWriteLimit = writeLimit('Too many review submissions. Please try again later.');
