import pino from 'pino';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty({
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname',
});

export const logger = pino(
  {
    name: 'HeursLogger',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  },
  stream,
);
