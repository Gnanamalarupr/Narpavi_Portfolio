import { authenticate, createToken, publicUser } from '../services/auth.service.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });
    const user = await authenticate(email, password);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    res.json({ success: true, data: { user: publicUser(user), token: createToken(user) } });
  } catch (error) { next(error); }
};
export const me = (req, res) => res.json({ success: true, data: { user: publicUser(req.user) } });
