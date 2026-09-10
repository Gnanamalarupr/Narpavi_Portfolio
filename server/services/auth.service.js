import crypto from 'node:crypto';
import { readCollection } from './jsonStore.service.js';

const secret = process.env.AUTH_SECRET || 'change-this-development-secret';
const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const sign = (value) => crypto.createHmac('sha256', secret).update(value).digest('base64url');

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
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password) || null;
};
export const publicUser = ({ password, ...user }) => user;
