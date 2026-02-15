export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SandboxError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 500, 'SANDBOX_ERROR', details);
  }
}

export class AIServiceError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 502, 'AI_SERVICE_ERROR', details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}
