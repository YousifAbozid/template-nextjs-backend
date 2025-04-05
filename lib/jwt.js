import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-strong-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT token
 * @param {Object} payload - Data to encode in the token
 * @returns {String} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token
 * @param {String} token - Token to verify
 * @returns {Object} Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request headers
 * @param {Request} req - Next.js request object
 * @returns {String|null} Token or null
 */
export function getTokenFromRequest(req) {
  const authHeader = req.headers.get('authorization') || '';

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}
