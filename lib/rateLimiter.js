import { createRateLimiter } from '@/middleware/rateLimiter';
import { getLogger } from '@/lib/logger';

const logger = getLogger();

/**
 * Create a rate limiter that can be used in API routes
 * @param {Object} options - Rate limiter options
 * @returns {Function} - Rate limiter function
 */
export function createApiRateLimiter(options = {}) {
  const rateLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 minute by default
    max: 60, // 60 requests per minute by default
    ...options,
  });

  return async function checkRateLimit(request) {
    return await rateLimiter(request);
  };
}

/**
 * Higher-order function to add rate limiting to an API handler
 * @param {Function} handler - API route handler
 * @param {Object} options - Rate limiter options
 * @returns {Function} - Handler with rate limiting
 */
export function withRateLimit(handler, options = {}) {
  const checkRateLimit = createApiRateLimiter(options);

  return async function (request, ...args) {
    // Check rate limit
    const rateLimitResponse = await checkRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Continue with the original handler
    return handler(request, ...args);
  };
}

/**
 * Function to create tiered rate limits based on user role or authentication status
 * @param {Object} options - Tiered rate limiter options
 * @returns {Function} - Handler with tiered rate limiting
 */
export function createTieredRateLimiter(options = {}) {
  const {
    anonymous = { windowMs: 60 * 1000, max: 30 },
    authenticated = { windowMs: 60 * 1000, max: 100 },
    admin = { windowMs: 60 * 1000, max: 300 },
    keyGenerator,
    ...restOptions
  } = options;

  // Create rate limiters for each tier
  const anonymousLimiter = createRateLimiter({
    ...anonymous,
    ...restOptions,
    keyGenerator:
      keyGenerator ||
      (req => `anon_${req.headers.get('x-forwarded-for') || 'unknown-ip'}`),
    identifier: 'anonymous',
  });

  const authenticatedLimiter = createRateLimiter({
    ...authenticated,
    ...restOptions,
    keyGenerator:
      keyGenerator ||
      (req => `auth_${req.headers.get('x-forwarded-for') || 'unknown-ip'}`),
    identifier: 'authenticated',
  });

  const adminLimiter = createRateLimiter({
    ...admin,
    ...restOptions,
    keyGenerator:
      keyGenerator ||
      (req => `admin_${req.headers.get('x-forwarded-for') || 'unknown-ip'}`),
    identifier: 'admin',
  });

  return async function tieredRateLimiter(request, userRole = null) {
    if (userRole === 'admin') {
      return adminLimiter(request);
    } else if (userRole) {
      return authenticatedLimiter(request);
    } else {
      return anonymousLimiter(request);
    }
  };
}

// Export preconfigured rate limiters for common use cases
export const strictRateLimiter = createApiRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests to this endpoint. Please try again later.',
  identifier: 'strict-api',
});

export const standardRateLimiter = createApiRateLimiter({
  identifier: 'standard-api',
});

export const generousRateLimiter = createApiRateLimiter({
  windowMs: 60 * 1000,
  max: 200,
  identifier: 'generous-api',
});
