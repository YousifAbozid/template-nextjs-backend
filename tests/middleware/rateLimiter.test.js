import {
  createRateLimiter,
  standardLimiter,
  strictLimiter,
  apiLimiter,
} from '@/middleware/rateLimiter';
import { mockMiddlewareRequest } from '../utils/testUtils';

describe('Rate Limiter Middleware', () => {
  beforeEach(() => {
    // Reset any mocks between tests
    jest.clearAllMocks();
  });

  describe('createRateLimiter', () => {
    it('should create a rate limiter with default options', async () => {
      const limiter = createRateLimiter();
      const request = mockMiddlewareRequest();

      const result = await limiter(request);
      expect(result).toBeNull(); // First request should not be rate limited
    });

    it('should rate limit after exceeding max requests', async () => {
      // Create a strict rate limiter with very low limit for testing
      const limiter = createRateLimiter({
        windowMs: 1000,
        max: 2, // Set very low limit for testing
        message: 'Test rate limit exceeded',
        statusCode: 429,
        identifier: 'test-limiter',
      });

      const request = mockMiddlewareRequest({
        headers: { 'x-forwarded-for': '127.0.0.1' },
      });

      // First two requests should pass
      expect(await limiter(request)).toBeNull();
      expect(await limiter(request)).toBeNull();

      // Third request should be rate limited
      const limitResponse = await limiter(request);
      expect(limitResponse).toBeInstanceOf(Response);
      expect(limitResponse.status).toBe(429);

      const responseBody = await limitResponse.json();
      expect(responseBody).toHaveProperty('error', 'Test rate limit exceeded');
    });
  });

  describe('Pre-configured limiters', () => {
    it('should have standardLimiter configured', async () => {
      expect(standardLimiter).toBeInstanceOf(Function);

      const request = mockMiddlewareRequest();
      const result = await standardLimiter(request);
      expect(result).toBeNull(); // First request should pass
    });

    it('should have strictLimiter configured with lower limit', async () => {
      expect(strictLimiter).toBeInstanceOf(Function);

      const request = mockMiddlewareRequest();
      const result = await strictLimiter(request);
      expect(result).toBeNull(); // First request should pass
    });

    it('should have apiLimiter configured', async () => {
      expect(apiLimiter).toBeInstanceOf(Function);

      const request = mockMiddlewareRequest();
      const result = await apiLimiter(request);
      expect(result).toBeNull(); // First request should pass
    });
  });
});
