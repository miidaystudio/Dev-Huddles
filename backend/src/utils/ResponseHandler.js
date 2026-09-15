/**
 * Standardized API response handler utility.
 * Formats consistent JSON envelopes for success, error, and paginated responses.
 */
export class ResponseHandler {
  /**
   * Send a success response.
   * @param {import("express").Response} res
   * @param {any} [data=null]
   * @param {string} [message="Success"]
   * @param {number} [statusCode=200]
   */
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a 201 Created response.
   * @param {import("express").Response} res
   * @param {any} [data=null]
   * @param {string} [message="Resource created successfully"]
   */
  static created(res, data = null, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  /**
   * Send a paginated response.
   * @param {import("express").Response} res
   * @param {Array} [data=[]]
   * @param {object} [pagination={}] - Pagination metadata (page, limit, total, totalPages)
   * @param {string} [message="Success"]
   * @param {number} [statusCode=200]
   */
  static paginate(res, data = [], pagination = {}, message = "Success", statusCode = 200) {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || (data.length > 0 ? data.length : 10);
    const total = Number(pagination.total ?? data.length);
    const totalPages = pagination.totalPages || Math.ceil(total / limit) || 1;

    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        ...pagination,
      },
    });
  }

  /**
   * Send an error response.
   * @param {import("express").Response} res
   * @param {string} [message="Internal Server Error"]
   * @param {number} [statusCode=500]
   * @param {any} [errors=null]
   */
  static error(res, message = "Internal Server Error", statusCode = 500, errors = null) {
    const payload = {
      success: false,
      message,
    };

    if (errors !== null && errors !== undefined) {
      payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
  }
}

export default ResponseHandler;
