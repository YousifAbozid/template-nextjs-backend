import {
  createApiRateLimiter,
  withRateLimit,
  createTieredRateLimiter,
  strictRateLimiter,
  standardRateLimiter,
  generousRateLimiter,
} from '@/lib/rateLimiter';
import { createRateLimiter } from '@/middleware/rateLimiter';
import { mockMiddlewareRequest } from '../utils/testUtils';

// Mock the dependent modules
jest.mock('@/middleware/rateLimiter', () => ({
  createRateLimiter: jest.fn().mockImplementation(() => {
    return jest.fn().mockResolvedValue(null);
  }),
}));

describe('Rate Limiter Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createApiRateLimiter', () => {
    it('should create an API rate limiter with default options', () => {
      createApiRateLimiter();

      expect(createRateLimiter).toHaveBeenCalledWith(
        expect.objectContaining({
          windowMs: 60 * 1000,
          max: 60,
        })
      );
    });

    it('should create an API rate limiter with custom options', () => {
      const customOptions = {
        windowMs: 30 * 1000,
        max: 20,
        identifier: 'custom',
      };

      createApiRateLimiter(customOptions);

      expect(createRateLimiter).toHaveBeenCalledWith(
        expect.objectContaining(customOptions)
      );
    });

    it('should return a function that calls the rate limiter', async () => {
      const mockedRateLimiter = jest.fn().mockResolvedValue(null);
      createRateLimiter.mockReturnValueOnce(mockedRateLimiter);

      const checkRateLimit = createApiRateLimiter();
      const request = mockMiddlewareRequest();

      await checkRateLimit(request);

      expect(mockedRateLimiter).toHaveBeenCalledWith(request);
    });
  });

  describe('withRateLimit', () => {
    it('should call the handler if not rate limited', async () => {
      const handler = jest.fn().mockResolvedValue('success');
      const wrappedHandler = withRateLimit(handler);

      const request = mockMiddlewareRequest();
      const result = await wrappedHandler(request);

      expect(result).toBe('success');
      expect(handler).toHaveBeenCalledWith(request);
    });

    it('should not call the handler and return rate limit response if rate limited', async () => {
      const rateLimitResponse = new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
        }
      );

      const mockLimiter = jest.fn().mockResolvedValue(rateLimitResponse);
      createRateLimiter.mockReturnValueOnce(mockLimiter);

      const handler = jest.fn().mockResolvedValue('success');
      const wrappedHandler = withRateLimit(handler);

      const request = mockMiddlewareRequest();
      const result = await wrappedHandler(request);

      expect(result).toBe(rateLimitResponse);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('createTieredRateLimiter', () => {
    it('should create rate limiters for different tiers', () => {
      createTieredRateLimiter();

      // Should have created three rate limiters
      expect(createRateLimiter).toHaveBeenCalledTimes(3);
    });

    it('should use the admin limiter for admin users', async () => {
      const mockAnonymousLimiter = jest.fn().mockResolvedValue(null);
      const mockAuthenticatedLimiter = jest.fn().mockResolvedValue(null);
      const mockAdminLimiter = jest.fn().mockResolvedValue(null);

      createRateLimiter
        .mockReturnValueOnce(mockAnonymousLimiter)
        .mockReturnValueOnce(mockAuthenticatedLimiter)
        .mockReturnValueOnce(mockAdminLimiter);

      const tieredLimiter = createTieredRateLimiter();
      const request = mockMiddlewareRequest();

      await tieredLimiter(request, 'admin');

      expect(mockAdminLimiter).toHaveBeenCalledWith(request);
      expect(mockAuthenticatedLimiter).not.toHaveBeenCalled();
      expect(mockAnonymousLimiter).not.toHaveBeenCalled();
    });

    it('should use the authenticated limiter for authenticated users', async () => {
      const mockAnonymousLimiter = jest.fn().mockResolvedValue(null);
      const mockAuthenticatedLimiter = jest.fn().mockResolvedValue(null);
      const mockAdminLimiter = jest.fn().mockResolvedValue(null);

      createRateLimiter
        .mockReturnValueOnce(mockAnonymousLimiter)
        .mockReturnValueOnce(mockAuthenticatedLimiter)
        .mockReturnValueOnce(mockAdminLimiter);

      const tieredLimiter = createTieredRateLimiter();
      const request = mockMiddlewareRequest();

      await tieredLimiter(request, 'user');

      expect(mockAuthenticatedLimiter).toHaveBeenCalledWith(request);
      expect(mockAdminLimiter).not.toHaveBeenCalled();
      expect(mockAnonymousLimiter).not.toHaveBeenCalled();
    });

    it('should use the anonymous limiter for unauthenticated users', async () => {
      const mockAnonymousLimiter = jest.fn().mockResolvedValue(null);
      const mockAuthenticatedLimiter = jest.fn().mockResolvedValue(null);
      const mockAdminLimiter = jest.fn().mockResolvedValue(null);

      createRateLimiter
        .mockReturnValueOnce(mockAnonymousLimiter)
        .mockReturnValueOnce(mockAuthenticatedLimiter)
        .mockReturnValueOnce(mockAdminLimiter);

      const tieredLimiter = createTieredRateLimiter();
      const request = mockMiddlewareRequest();

      await tieredLimiter(request, null);

      expect(mockAnonymousLimiter).toHaveBeenCalledWith(request);
      expect(mockAuthenticatedLimiter).not.toHaveBeenCalled();
      expect(mockAdminLimiter).not.toHaveBeenCalled();
    });
  });

  describe('Pre-configured rate limiters', () => {
    it('should export pre-configured rate limiters', () => {
      expect(strictRateLimiter).toBeDefined();
      expect(standardRateLimiter).toBeDefined();
      expect(generousRateLimiter).toBeDefined();
    });
  });
});
