import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export const AUTH_COOKIE = 'auth_token';
const PASSWORD_PREFIX = 'scrypt';

const safeEqual = (left, right) => {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && timingSafeEqual(a, b);
};

export const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${PASSWORD_PREFIX}$${salt}$${hash}`;
};

export const isPasswordHashed = (password) =>
  typeof password === 'string' && password.startsWith(`${PASSWORD_PREFIX}$`);

export const verifyPassword = (password, storedPassword) => {
  if (!password || !storedPassword) return false;
  if (!isPasswordHashed(storedPassword)) return safeEqual(password, storedPassword);

  const [, salt, expected] = storedPassword.split('$');
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString('hex');
  return safeEqual(actual, expected);
};

const getSessionToken = (config) =>
  createHmac('sha256', config.authSecret)
    .update('link-page-manager-session-v1')
    .digest('hex');

export const setAuthCookie = (response, config = db.getConfig()) => {
  response.cookies.set(AUTH_COOKIE, getSessionToken(config), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
};

export const clearAuthCookie = (response) => {
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
};

export const isAuthenticated = async () => {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  const config = db.getConfig();
  if (!token || !config.setupCompleted || !config.authSecret) return false;
  return safeEqual(token, getSessionToken(config));
};
