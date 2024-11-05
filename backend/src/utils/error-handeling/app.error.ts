export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
  
    constructor(message: string, statusCode: number, isOperational: boolean = true) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      Error.captureStackTrace(this);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
      super(message, 404);
    }
  }
  
  export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
      super(message, 401);
    }
  }
  
  export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
      super(message, 400);
    }
  }
  