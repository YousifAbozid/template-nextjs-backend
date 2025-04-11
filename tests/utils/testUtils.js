import { createMocks } from 'node-mocks-http';
import { NextResponse } from 'next/server';

/**
 * Creates mock Next.js API request and response objects
 * @param {Object} options - Options for the mock
 * @returns {Object} - The mocked req and res objects
 */
export function mockRequestResponse(options = {}) {
  const {
    method = 'GET',
    path = '/api/test',
    query = {},
    body = {},
    headers = {},
  } = options;

  const { req, res } = createMocks({
    method,
    url: path,
    query,
    body,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  });

  return { req, res };
}

/**
 * Creates a mock Next.js middleware request
 * @param {Object} options - Options for the mock
 * @returns {Object} - The mocked request object
 */
export function mockMiddlewareRequest(options = {}) {
  const {
    method = 'GET',
    url = 'http://localhost:3000/api/test',
    headers = {},
  } = options;

  // Create a mock request object that mimics the structure Next.js middleware expects
  const request = new Request(url, {
    method,
    headers: new Headers(headers),
  });

  // Add NextURL property that middleware uses
  request.nextUrl = new URL(url);

  return request;
}

/**
 * Creates a mock user with different roles
 * @param {String} role - User role ('anonymous', 'user', 'admin')
 * @returns {Object} - The mock user
 */
export function mockUser(role = 'user') {
  const users = {
    anonymous: null,
    user: {
      id: 'user-id-123',
      email: 'user@example.com',
      role: 'user',
    },
    admin: {
      id: 'admin-id-123',
      email: 'admin@example.com',
      role: 'admin',
    },
  };

  return users[role] || users.user;
}
