import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(data: T, message?: string, status: number = 200): ApiResponse<T> {
    return {
      data,
      message: message || 'Request successful',
      success: true,
      status,
    };
  }

  static error(
    message: string = 'Request failed',
    status: number = 400,
    errors?: Record<string, string[]>
  ): ApiResponse {
    return {
      message,
      success: false,
      errors,
      status,
    };
  }

  static validationError(errors: Record<string, string[]>): ApiResponse {
    return {
      message: 'Validation failed',
      success: false,
      errors,
      status: 422,
    };
  }
}