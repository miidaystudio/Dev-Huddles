import { AppError } from "../utils/AppError.js";
import { ResponseHandler } from "../utils/ResponseHandler.js";
import { ENV_CONFIG } from "../config/env.js";

/**
 * 404 handler for catching unhandled/unmatched routes
 */
export const notFoundHandler = (req, res, next) => {
  next(AppError.notFound(`Cannot find ${req.method} ${req.originalUrl} on this server`));
};

/**
 * Global Express error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  const isDev = ENV_CONFIG.NODE_ENV === "development";

  // Handle Express body-parser invalid JSON syntax error
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON payload in request body";
  }

  // Hide internal server error details in production for non-operational bugs
  if (!isDev && !err.isOperational && statusCode === 500) {
    message = "Something went wrong on our end. Please try again later.";
  }

  const errors = err.errors || (isDev && err.stack ? { stack: err.stack } : null);

  return ResponseHandler.error(res, message, statusCode, errors);
};

export default errorHandler;
