export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
  status: number;
}