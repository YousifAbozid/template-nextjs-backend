import { getLogger } from '@/lib/logger';

const logger = getLogger();

/**
 * Simple in-memory store for rate limiting
 * Note: In serverless environments like Vercel, this will reset between invocations
 * For production with multiple instances or serverless, use Redis or another external store
 */
class MemoryStore {
  constructor() {
    this.store = new Map();
    // Clean up the store periodically (if running in a long-lived environment)
    if (typeof setTimeout === 'function') {
      const interval = setInterval(() => this.cleanup(), 1000 * 60 * 10); // Clean every 10 minutes
      // Prevent the interval from keeping Node.js process alive
      if (interval && interval.unref) {
        interval.unref();
      }
    }
  }

  // Get current hit count for a key
  get(key) {
    if (!this.store.has(key)) {
      return { count: 0, resetTime: Date.now() + 0 };
    }
    return this.store.get(key);
  }

  // Increment hit count for a key
  increment(key, windowMs) {
    const now = Date.now();
    const record = this.get(key);

    // If the window has expired, reset the counter
    if (now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return 1;
    }

    // Otherwise increment the counter
    const updatedRecord = {
      count: record.count + 1,
      resetTime: record.resetTime,
    };
    this.store.set(key, updatedRecord);
    return updatedRecord.count;
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Creates a configurable rate limiter middleware
 */
export function createRateLimiter(options = {}) {
  const {
    windowMs = process.env.RATE_LIMIT_WINDOW_MS
      ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
      : 60 * 1000, // 1 minute by default
    max = process.env.RATE_LIMIT_MAX_REQUESTS
      ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
      : 60, // 60 requests per windowMs by default
    message = 'Too many requests, please try again later.',
    statusCode = 429, // Too Many Requests
    keyGenerator = request => {
      // Use IP address as default key
      return (
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown-ip'
      );
    },
    skip = () => false, // No requests are skipped by default
    store = new MemoryStore(),
    identifier = 'standard', // For logging purposes
  } = options;

  return async function rateLimiter(request) {
    // Skip rate limiting if the condition is met
    if (skip(request)) {
      return null;
    }

    // Generate a unique key for this request
    const key = keyGenerator(request);

    // Increment the counter for this key
    const count = store.increment(key, windowMs);

    // Get reset time
    const resetTime = store.get(key).resetTime;

    // If the count exceeds the maximum, return a response
    if (count > max) {
      const url = new URL(request.url);
      logger.warn(`[RateLimit:${identifier}] Rate limit exceeded: ${key}`, {
        path: url.pathname,
        ip: key,
        count,
        max,
        resetIn: Math.ceil((resetTime - Date.now()) / 1000),
      });

      return Response.json(
        { error: message },
        {
          status: statusCode,
          headers: {
            'X-RateLimit-Limit': String(max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)), // In seconds
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // Otherwise, allow the request to proceed
    return null;
  };
}

// Create different rate limiters for different use cases
export const standardLimiter = createRateLimiter({
  identifier: 'standard',
});

export const strictLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_STRICT_MAX
    ? parseInt(process.env.RATE_LIMIT_STRICT_MAX)
    : 10, // 10 requests per minute
  message: 'Too many authentication attempts, please try again later.',
  identifier: 'strict',
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_API_MAX
    ? parseInt(process.env.RATE_LIMIT_API_MAX)
    : 120, // 120 requests per minute for API
  identifier: 'api',
});
