import { NextResponse } from 'next/server';
import { logApiRequest } from '@/lib/logger';
import { apiLimiter, strictLimiter } from '@/middleware/rateLimiter';

export async function middleware(request) {
  // Apply rate limiting based on path
  let rateLimiterResponse = null;

  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    // Stricter rate limiting for auth endpoints
    rateLimiterResponse = await strictLimiter(request);
  } else if (request.nextUrl.pathname.startsWith('/api/')) {
    // Standard API rate limiting
    rateLimiterResponse = await apiLimiter(request);
  }

  // Return rate limiter response if it exists
  if (rateLimiterResponse) {
    return rateLimiterResponse;
  }

  // Log API requests for debugging
  if (request.nextUrl.pathname.startsWith('/api/')) {
    logApiRequest(request);
  }

  // Add any global middleware logic here
  const response = NextResponse.next();

  // Add headers to response
  response.headers.set('x-api-version', process.env.API_VERSION || '1.0.0');

  return response;
}

export const config = {
  // Apply this middleware to all API routes
  matcher: '/api/:path*',
};
