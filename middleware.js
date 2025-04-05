import { NextResponse } from 'next/server';
import { logApiRequest } from '@/lib/logger';

export function middleware(request) {
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
