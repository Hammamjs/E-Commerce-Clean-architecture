import 'express';

declare module 'express' {
  export interface Request {
    logContext?: {
      requestId: string;
      ip: string;
      method: string;
      path: string;
      userAgent?: string;
    };
  }
}
