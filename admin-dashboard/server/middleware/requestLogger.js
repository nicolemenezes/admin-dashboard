import morgan from 'morgan';
import env from '../config/env.js';

morgan.token('user', (req) => (req.user ? `User:${req.user._id}` : 'Anonymous'));
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) return '-';
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 + (res._startAt[1] - req._startAt[1]) * 1e-6;
  return ms.toFixed(3);
});

const devFormat = ':method :url :status :response-time-ms ms - :user';
const prodFormat = ':remote-addr - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

export const morganLogger =
  env.nodeEnv === 'development'
    ? morgan(devFormat)
    : morgan(prodFormat, { skip: (req, res) => res.statusCode < 400 });

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
};