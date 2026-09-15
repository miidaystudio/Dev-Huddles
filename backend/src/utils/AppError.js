/**
 * Custom application error class for handling operational errors.
 * Extends the native JavaScript Error class with HTTP status codes and operational flags.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} [statusCode=500] - HTTP status code (e.g. 400, 404, 500)
   * @param {any} [errors=null] - Additional validation errors or context details
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errors = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 400 Bad Request
   */
  static badRequest(message = "Bad Request", errors = null) {
    return new AppError(message, 400, errors);
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized(message = "Unauthorized access") {
    return new AppError(message, 401);
  }

  /**
   * 403 Forbidden
   */
  static forbidden(message = "Access forbidden") {
    return new AppError(message, 403);
  }

  /**
   * 404 Not Found
   */
  static notFound(message = "Resource not found") {
    return new AppError(message, 404);
  }

  /**
   * 409 Conflict
   */
  static conflict(message = "Resource conflict") {
    return new AppError(message, 409);
  }

  /**
   * 422 Unprocessable Entity
   */
  static unprocessableEntity(message = "Unprocessable Entity", errors = null) {
    return new AppError(message, 422, errors);
  }

  /**
   * 500 Internal Server Error
   */
  static internal(message = "Internal Server Error") {
    return new AppError(message, 500);
  }
}

export default AppError;
