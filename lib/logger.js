import { createLogger, format, transports } from 'winston';

// Check if we're in Edge Runtime or Node.js environment
// Avoid using Node.js APIs directly in the detection
const isEdgeRuntime =
  typeof globalThis.EdgeRuntime !== 'undefined' ||
  typeof process === 'undefined' ||
  (typeof process !== 'undefined' &&
    process.env &&
    process.env.__NEXT_RUNTIME === 'edge');

// Simple logger for Edge Runtime
class SimpleLogger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      verbose: 4,
      debug: 5,
      silly: 6,
    };
  }

  log(level, message, meta = {}) {
    if (typeof console[level] === 'function') {
      console[level](`[${level}]: ${message}`, meta);
    } else {
      console.log(`[${level}]: ${message}`, meta);
    }
  }

  error(message, meta) {
    this.log('error', message, meta);
  }
  warn(message, meta) {
    this.log('warn', message, meta);
  }
  info(message, meta) {
    this.log('info', message, meta);
  }
  http(message, meta) {
    this.log('log', message, meta);
  }
  verbose(message, meta) {
    this.log('debug', message, meta);
  }
  debug(message, meta) {
    this.log('debug', message, meta);
  }
  silly(message, meta) {
    this.log('debug', message, meta);
  }
}

// Configure log formats for Node.js environment
const logFormat = !isEdgeRuntime
  ? format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    )
  : null;

// Create console transport with colored output for development
const consoleLogFormat = !isEdgeRuntime
  ? format.combine(
      format.colorize(),
      format.printf(({ level, message, timestamp, ...metadata }) => {
        let metaStr = '';
        if (Object.keys(metadata).length > 0 && metadata.stack !== undefined) {
          metaStr = '\n' + metadata.stack;
        } else if (Object.keys(metadata).length > 0) {
          metaStr = '\n' + JSON.stringify(metadata, null, 2);
        }
        return `${timestamp} [${level}]: ${message}${metaStr}`;
      })
    )
  : null;

// Initialize the logger
let logger;

/**
 * Get a configured logger instance
 * @returns {object} Logger instance
 */
export function getLogger() {
  if (logger) {
    return logger;
  }

  // For Edge Runtime, use the simple logger
  if (isEdgeRuntime) {
    logger = new SimpleLogger();
    return logger;
  }

  // For Node.js environment, use Winston
  const isProd = process.env.NODE_ENV === 'production';
  const logLevel = process.env.LOG_LEVEL || (isProd ? 'info' : 'debug');

  // Create logger with different transports based on environment
  logger = createLogger({
    level: logLevel,
    format: logFormat,
    defaultMeta: { service: 'nextjs-api' },
    transports: [
      // Always log to console
      new transports.Console({
        format: consoleLogFormat,
      }),
    ],
  });

  // Only add file transports in production if not in Vercel environment
  if (isProd && !process.env.VERCEL) {
    try {
      logger.add(
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        })
      );
      logger.add(
        new transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        })
      );
    } catch (err) {
      console.warn('Could not initialize file logging', err.message);
    }
  }

  return logger;
}

/**
 * Log API requests
 * @param {Request} request - Next.js request object
 * @param {string} source - Source information (optional)
 */
export function logApiRequest(request, source = '') {
  const logger = getLogger();
  const url = new URL(request.url);

  logger.info(`API Request: ${request.method} ${url.pathname}${url.search}`, {
    method: request.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    source,
    headers: {
      'user-agent': request.headers.get('user-agent'),
      'content-type': request.headers.get('content-type'),
      'x-forwarded-for': request.headers.get('x-forwarded-for') || 'direct',
    },
  });
}
