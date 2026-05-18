/**
 * Shared types for admin auth + API responses.
 */

export type AdminRole = "admin" | "editor";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  image?: string;
  token_version?: number;
}

/**
 * Shape of every backend response from sendResponse() in the server.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  errorSources?: { path: string; message: string }[];
  stack?: string;
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorPayload | null;

  constructor(status: number, message: string, body: ApiErrorPayload | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
