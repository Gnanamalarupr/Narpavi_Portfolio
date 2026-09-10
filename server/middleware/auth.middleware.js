import { verifyToken } from '../services/auth.service.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = await verifyToken(token);
    if (!user) return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
    req.user = user;
    next();
  } catch (error) { next(error); }
};
export const requireAdmin = [requireAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access is required.' });
  next();
}];
