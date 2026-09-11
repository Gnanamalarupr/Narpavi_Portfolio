import crypto from 'node:crypto';
import { getModels } from '../models/index.js';
import { OAuth2Client } from 'google-auth-library';

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const getSecret = () => {
  if (!process.env.AUTH_SECRET) throw new Error('AUTH_SECRET must be configured before starting the API.');
  return process.env.AUTH_SECRET;
};
const sign = (value) => crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
const hashPassword = async (password, salt = crypto.randomBytes(16).toString('hex')) => new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, 64, (error, derivedKey) => error ? reject(error) : resolve(`scrypt$${salt}$${derivedKey.toString('hex')}`));
});
const verifyPassword = async (password, stored) => {
  if (!stored) return false;
  const [, salt, expected] = stored.split('$');
  if (!salt || !expected) return false;
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, derivedKey) => {
    if (error) return reject(error);
    const actual = Buffer.from(derivedKey.toString('hex'), 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');
    resolve(actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer));
  }));
};

export const createToken = (user) => {
  const payload = encode({ sub: user.id, role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 });
  return `${payload}.${sign(payload)}`;
};
export const verifyToken = async (token) => {
  const [payload, signature] = token?.split('.') || [];
  const expected = payload ? sign(payload) : '';
  if (!payload || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (data.exp < Date.now()) return null;
  return getModels().User.findByPk(data.sub);
};
export const authenticate = async (email, password) => {
  const user = await getModels().User.findOne({ where: { email: email.toLowerCase() } });
  return user && await verifyPassword(password, user.password) ? user : null;
};
export const registerCustomer = async ({ name, email, password }) => {
  const User = getModels().User;
  const normalizedEmail = email.toLowerCase();
  if (await User.findOne({ where: { email: normalizedEmail } })) { const error = new Error('An account with this email already exists.'); error.status = 409; throw error; }
  const user = await User.create({ id: `u-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`, name, email: normalizedEmail, password: await hashPassword(password), role: 'customer', authProvider: 'password' });
  return user;
};
export const authenticateGoogleCustomer = async (credential) => {
  if (!process.env.GOOGLE_CLIENT_ID) throw Object.assign(new Error('Google sign-in is not configured.'), { status: 503 });
  const ticket = await new OAuth2Client(process.env.GOOGLE_CLIENT_ID).verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email || !payload.email_verified) throw Object.assign(new Error('Google account could not be verified.'), { status: 401 });
  const User = getModels().User;
  let user = await User.findOne({ where: { googleId: payload.sub } });
  if (!user) user = await User.findOne({ where: { email: payload.email.toLowerCase() } });
  if (user?.role === 'admin') throw Object.assign(new Error('Admin accounts must use email and password.'), { status: 403 });
  if (!user) user = await User.create({ id: `u-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`, name: payload.name || payload.email.split('@')[0], email: payload.email.toLowerCase(), password: null, googleId: payload.sub, authProvider: 'google', role: 'customer' });
  else if (!user.googleId) await user.update({ googleId: payload.sub, authProvider: 'google' });
  return user;
};
export const publicUser = (user) => {
  const { password, ...data } = user.toJSON ? user.toJSON() : user;
  return data;
};
export { hashPassword };
