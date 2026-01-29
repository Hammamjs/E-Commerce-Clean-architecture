import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['requestId'] = randomUUID();

    req['logContext'] = {
      requestId: randomUUID(),
      ip: req.ip || 'null',
      method: req.method,
      path: req.originalUrl,
      userAgent: req.header['user-agent'] as string,
    };

    next();
  }
}
