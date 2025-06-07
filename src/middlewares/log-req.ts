import { Request, Response, NextFunction } from 'express';
import logger from './activity-logger'; // สมมติไฟล์ logger.ts หรือ logger.js ของคุณ

const logRequest = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // ดึง IP จาก header หรือ connection
  const ip =
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'unknown';
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    logger.info(
      `Action performed - ip=${ip}, method=${method}, path=${originalUrl}, status=${status}, duration=${duration}ms`
    );
  });

  next();
};

export default logRequest;
