import { NextResponse } from 'next/server';

export function middleware(request) {
  // Log API requests for debugging
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[API] ${request.method} ${request.nextUrl.pathname}`);
  }

  // Add any global middleware logic here
  const response = NextResponse.next();

  // Add headers to response
  response.headers.set('x-api-version', '1.0.0');

  return response;
}

export const config = {
  // Apply this middleware to all API routes
  matcher: '/api/:path*',
};
