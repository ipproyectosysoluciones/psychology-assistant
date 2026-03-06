/**
 * @module ApiResponse
 * @description Clase para estandarizar todas las respuestas de la API.
 * ES: Proporciona una respuesta consistente en todos los endpoints.
 * EN: Provides consistent response format across all endpoints.
 */

export class ApiResponse {
  constructor (statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.timestamp = new Date().toISOString();
  }

  static success (data, message = 'Operation successful', statusCode = 200) {
    return new ApiResponse(statusCode, data, message);
  }

  static error (message = 'An error occurred', statusCode = 500, data = null) {
    return new ApiResponse(statusCode, data, message);
  }

  static created (data, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  static badRequest (message = 'Bad request', data = null) {
    return new ApiResponse(400, data, message);
  }

  static notFound (message = 'Resource not found') {
    return new ApiResponse(404, null, message);
  }

  static unauthorized (message = 'Unauthorized access') {
    return new ApiResponse(401, null, message);
  }

  static forbidden (message = 'Forbidden') {
    return new ApiResponse(403, null, message);
  }
}

export const sendResponse = (res, response) => {
  return res.status(response.statusCode).json(response);
};
