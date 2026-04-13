import { Response } from 'express';

/**
 * @module ApiResponse
 * @description Standardized API response class.
 * ES: Proporciona una respuesta consistente en todos los endpoints.
 * EN: Provides consistent response format across all endpoints.
 */
export class ApiResponse {
  statusCode: number;
  data: unknown;
  message: string;
  success: boolean;
  timestamp: string;
  errors?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, data: unknown = null, message: string = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.timestamp = new Date().toISOString();
  }

  static success(
    data: unknown,
    message: string = 'Operation successful',
    statusCode: number = 200
  ): ApiResponse {
    return new ApiResponse(statusCode, data, message);
  }

  static error(
    message: string = 'An error occurred',
    statusCode: number = 500,
    data: unknown = null
  ): ApiResponse {
    return new ApiResponse(statusCode, data, message);
  }

  static created(data: unknown, message: string = 'Resource created successfully'): ApiResponse {
    return new ApiResponse(201, data, message);
  }

  static badRequest(message: string = 'Bad request', data: unknown = null): ApiResponse {
    return new ApiResponse(400, data, message);
  }

  static notFound(message: string = 'Resource not found'): ApiResponse {
    return new ApiResponse(404, null, message);
  }

  static unauthorized(message: string = 'Unauthorized access'): ApiResponse {
    return new ApiResponse(401, null, message);
  }

  static forbidden(message: string = 'Forbidden'): ApiResponse {
    return new ApiResponse(403, null, message);
  }
}

interface SendResponseOptions {
  stack?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const sendResponse = (
  res: Response,
  response: ApiResponse,
  options?: SendResponseOptions
): void => {
  const resObj = response as ApiResponse & SendResponseOptions;
  if (options?.stack) {
    resObj.stack = options.stack;
  }
  if (options?.errors) {
    resObj.errors = options.errors;
  }
  res.status(response.statusCode).json(resObj);
};
