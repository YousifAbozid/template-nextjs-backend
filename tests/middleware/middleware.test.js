import { middleware, config } from '@/middleware';
import { strictLimiter, apiLimiter } from '@/middleware/rateLimiter';
import { mockMiddlewareRequest } from '../utils/testUtils';
import { logApiRequest } from '@/lib/logger';

// Mock the dependent modules
jest.mock('@/middleware/rateLimiter', () => ({
  strictLimiter: jest.fn().mockResolvedValue(null),
  apiLimiter: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/lib/logger', () => ({
  logApiRequest: jest.fn(),
}));

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply strict rate limiting to auth endpoints', async () => {
    const request = mockMiddlewareRequest({
      url: 'http://localhost:3000/api/auth/login',
    });

    await middleware(request);

    expect(strictLimiter).toHaveBeenCalledWith(request);
    expect(apiLimiter).not.toHaveBeenCalled();
  });

  it('should apply API rate limiting to other API endpoints', async () => {
    const request = mockMiddlewareRequest({
      url: 'http://localhost:3000/api/users',
    });

    await middleware(request);

    expect(apiLimiter).toHaveBeenCalledWith(request);
    expect(strictLimiter).not.toHaveBeenCalled();
  });

  it('should log API requests for API endpoints', async () => {
    const request = mockMiddlewareRequest({
      url: 'http://localhost:3000/api/products',
    });

    await middleware(request);

    expect(logApiRequest).toHaveBeenCalledWith(request);
  });

  it('should add API version header to the response', async () => {
    const request = mockMiddlewareRequest({
      url: 'http://localhost:3000/api/test',
    });

    const response = await middleware(request);

    expect(response.headers.get('x-api-version')).toBe('1.0.0');
  });

  it('should return rate limiter response if rate limited', async () => {
    const rateLimitResponse = new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      {
        status: 429,
      }
    );

    strictLimiter.mockResolvedValueOnce(rateLimitResponse);

    const request = mockMiddlewareRequest({
      url: 'http://localhost:3000/api/auth/login',
    });

    const response = await middleware(request);

    expect(response).toBe(rateLimitResponse);
    expect(logApiRequest).not.toHaveBeenCalled(); // Should not log if rate limited
  });

  it('should have the correct matcher configuration', () => {
    expect(config).toHaveProperty('matcher', '/api/:path*');
  });
});
