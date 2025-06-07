import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import dayjs from 'dayjs';

// ฟอร์แมต log แบบกำหนดเอง
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const time =
    typeof timestamp === 'string' ? timestamp : new Date().toISOString();

  const formattedTime = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  return `${formattedTime} [${level.toUpperCase()}] ${message}`;
});

// Daily rotate file transport
const dailyRotateTransport: winston.transport = new (
  transports as any
).DailyRotateFile({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '180d'
});

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), customFormat),
  transports: [dailyRotateTransport, new transports.Console()]
});

export default logger;
