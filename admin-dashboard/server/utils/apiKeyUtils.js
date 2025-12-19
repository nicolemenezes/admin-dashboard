import crypto from 'crypto';

const API_KEY_PREFIX_LENGTH = 8;

/**
 * Generate a new API key
 * @param {String} environment - 'live' or 'test'
 * @returns {Object} Object containing key, prefix, and hashedKey
 */
export const generateApiKey = (environment = 'live') => {
  const randomString = crypto.randomBytes(24).toString('hex');
  const prefix = `ak_${environment}`;
  const key = `${prefix}_${randomString}`;
  const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
  return { key, prefix, hashedKey };
};

/**
 * Hash an API key for storage/comparison
 * @param {String} key - API key to hash
 * @returns {String} Hashed key
 */
export const hashApiKey = async (key) =>
  crypto.createHash('sha256').update(key).digest('hex');

/**
 * Extract API key from request headers
 * @param {Object} req - Express request object
 * @returns {String|null} Extracted API key or null
 */
export const extractApiKey = (req) => {
  if (req.headers['x-api-key']) return req.headers['x-api-key'];
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token.startsWith('ak_')) return token;
  }
  if (req.query.api_key) return req.query.api_key;
  return null;
};

/**
 * Validate API key format
 * @param {String} key - API key to validate
 * @returns {Boolean} True if format is valid
 */
export const isValidApiKeyFormat = (key) => /^ak_(live|test)_[a-f0-9]{48}$/.test(key);

/**
 * Get API key prefix
 * @param {String} key - API key
 * @returns {String} Prefix (e.g., 'ak_live')
 */
export const getApiKeyPrefix = (key) => {
  if (!key) return null;
  const parts = key.split('_');
  if (parts.length >= 2) return `${parts[0]}_${parts[1]}`;
  return null;
};

/**
 * Mask API key for display (show only first and last 4 chars)
 * @param {String} key - API key to mask
 * @returns {String} Masked key
 */
export const maskApiKey = (key) => {
  if (!key || key.length < 20) return '****';
  const prefix = key.substring(0, 12);
  const suffix = key.substring(key.length - 4);
  return `${prefix}${'*'.repeat(32)}${suffix}`;
};