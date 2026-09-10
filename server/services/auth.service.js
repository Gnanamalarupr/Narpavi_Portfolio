import crypto from 'node:crypto';
import { readCollection } from './jsonStore.service.js';

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
  const users = await readCollection('users.json');
  return users.find((user) => user.id === data.sub) || null;
};
export const authenticate = async (email, password) => {
  const users = await readCollection('users.json');
  for (const user of users) {
    if (user.email.toLowerCase() === email.toLowerCase() && await verifyPassword(password, user.password)) return user;
  }
  return null;
};
export const publicUser = ({ password, ...user }) => user;
export { hashPassword };
