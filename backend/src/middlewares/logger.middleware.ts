import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logEvents } from 'src/utils/error-handeling/log-error.handeler.middleware';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin || 'unknown origin';
    logEvents(`${req.method}\t${req.url}\t${origin}`, 'reqLog.log')
      .then(() => console.log(`${req.method} ${req.path}`))
      .catch((err) => console.error('Logger error:', err.message));
    next();
  }
}
