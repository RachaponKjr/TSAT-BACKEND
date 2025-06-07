import logger from './activity-logger';

// HTTP Request Logger Middleware
const httpLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  logger.info(
    `${req.method} ${req.originalUrl} - IP: ${
      req.ip || req.connection.remoteAddress
    }`
  );

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Log response
    logger.info(
      `${req.method} ${req.originalUrl} - ${statusCode} - ${duration}ms`
    );

    // Call original end
    originalEnd.apply(this, args);
  };

  next();
};

// Error Logger Middleware
const errorLogger = (err, req, res, next) => {
  // Log error with stack trace
  logger.error(
    `${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`,
    {
      error: err.stack,
      body: req.body,
      params: req.params,
      query: req.query
    }
  );

  next(err);
};

// Request Info Logger
const requestLogger = (req, res, next) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };

  // Log request details
  logger.info('Request received', logData);

  next();
};

export { httpLogger, errorLogger, requestLogger, logger };
