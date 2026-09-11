import { authenticate, authenticateGoogleCustomer, createToken, publicUser, registerCustomer } from '../services/auth.service.js';

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
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must contain at least 8 characters.' });
    const user = await registerCustomer({ name, email, password });
    res.status(201).json({ success: true, data: { user: publicUser(user), token: createToken(user) } });
  } catch (error) { next(error); }
};
export const googleLogin = async (req, res, next) => {
  try { const user = await authenticateGoogleCustomer(req.body.credential); res.json({ success: true, data: { user: publicUser(user), token: createToken(user) } }); }
  catch (error) { next(error); }
};
