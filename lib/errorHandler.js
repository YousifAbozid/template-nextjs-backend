/**
 * Standard error response for API routes
 */
export class ApiError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Helps distinguish between operational and programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle error and return appropriate response
 * @param {Error} error - The error object
 * @param {string} source - Source of the error (for logging)
 * @returns {Response} - Formatted error response
 */
export function handleApiError(error, source = 'API') {
  // If it's our custom API error, use its status code
  if (error instanceof ApiError) {
    const logger = getLogger();
    logger.error(`[${source}] ${error.message}`, {
      statusCode: error.statusCode,
      errors: error.errors,
      stack: error.stack,
    });

    return Response.json(
      {
        error: error.message,
        ...(error.errors && { validationErrors: error.errors }),
        success: false,
      },
      { status: error.statusCode }
    );
  }

  // For Mongoose validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).reduce((acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {});

    const logger = getLogger();
    logger.error(`[${source}] Validation Error`, {
      errors,
      stack: error.stack,
    });

    return Response.json(
      {
        error: 'Validation failed',
        validationErrors: errors,
        success: false,
      },
      { status: 400 }
    );
  }

  // For Mongoose duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];
    const message = `Duplicate value: ${value} for field: ${field}`;

    const logger = getLogger();
    logger.error(`[${source}] Duplicate Key Error: ${message}`, {
      field,
      value,
      stack: error.stack,
    });

    return Response.json(
      {
        error: message,
        success: false,
      },
      { status: 409 }
    );
  }

  // For all other errors
  console.error(`[${source}] Unhandled Error:`, error);

  const logger = getLogger();
  logger.error(`[${source}] Unhandled Error`, {
    message: error.message,
    stack: error.stack,
  });

  // Don't leak error details in production
  const isDev = process.env.NODE_ENV === 'development';
  return Response.json(
    {
      error: isDev ? error.message : 'Internal server error',
      ...(isDev && { stack: error.stack }),
      success: false,
    },
    { status: 500 }
  );
}

/**
 * Helper to create not found error
 * @param {string} entity - The entity that wasn't found
 * @returns {ApiError} - Not found error
 */
export function createNotFoundError(entity = 'Resource') {
  return new ApiError(`${entity} not found`, 404);
}

/**
 * Helper to create bad request error
 * @param {string} message - Error message
 * @param {object} errors - Validation errors
 * @returns {ApiError} - Bad request error
 */
export function createBadRequestError(message = 'Bad request', errors = null) {
  return new ApiError(message, 400, errors);
}

/**
 * Helper to create unauthorized error
 * @param {string} message - Error message
 * @returns {ApiError} - Unauthorized error
 */
export function createUnauthorizedError(message = 'Authentication required') {
  return new ApiError(message, 401);
}

/**
 * Helper to create forbidden error
 * @param {string} message - Error message
 * @returns {ApiError} - Forbidden error
 */
export function createForbiddenError(message = 'Access denied') {
  return new ApiError(message, 403);
}

/**
 * Helper to create conflict error
 * @param {string} message - Error message
 * @returns {ApiError} - Conflict error
 */
export function createConflictError(message = 'Resource conflict') {
  return new ApiError(message, 409);
}

// Import from logger.js
import { getLogger } from '@/lib/logger';
