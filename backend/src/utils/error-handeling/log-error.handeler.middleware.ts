import { format } from 'date-fns';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';

const logEvents = async (message: string, logFileName: string) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem = `${dateTime}\t${message}\n`;

  try {
    const logsDir = path.join(process.cwd(), 'logs'); // Use process.cwd() to get the project root directory
    if (!fs.existsSync(logsDir)) {
      await fs.mkdir(logsDir);
    }
    await fs.appendFile(path.join(logsDir, logFileName), logItem);
  } catch (err) {
    console.error('Failed to log event:', err.message);
  }
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || 'unknown origin';
  logEvents(`${req.method}\t${req.url}\t${origin}`, 'reqLog.log')
    .then(() => console.log(`${req.method} ${req.path}`))
    .catch((err) => console.error('Logger error:', err.message));
  next();
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const origin = req.headers.origin || 'unknown origin';
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${origin}`,
    'errLog.log',
  )
    .then(() => console.error(err.stack))
    .catch((logErr) =>
      console.error('Error handler log error:', logErr.message),
    );

  const status = res.statusCode ? res.statusCode : 500; // server error
  res.status(status).json({ message: err.message });
};

export { logEvents, logger, errorHandler };
