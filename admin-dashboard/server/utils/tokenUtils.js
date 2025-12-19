import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, env.jwt.accessSecret, { expiresIn: env.jwt.expiresIn });

export const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);

export const extractTokenFromHeader = (authHeader) => {
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
};
