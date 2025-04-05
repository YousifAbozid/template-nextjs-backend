import { createLogger, format, transports } from 'winston';

// Configure log formats
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create console transport with colored output for development
const consoleLogFormat = format.combine(
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
);

// Initialize the logger
let logger;

/**
 * Get a configured logger instance
 * @returns {object} Winston logger instance
 */
export function getLogger() {
  if (logger) {
    return logger;
  }

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

  // Add file transports in production
  if (isProd) {
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
