import {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';

import winston from './winston';

const stderrStream = (req: Request, res: Response, next: NextFunction) => {
  morgan('combined', {
    skip() {
      return res.statusCode < 400;
    },
    stream: {
      write(message: string) {
        winston.error(message);
      },
    },
  });
  next();
};

const stdoutStream = (req: Request, res: Response, next: NextFunction) => {
  morgan('combined', {
    skip() {
      return res.statusCode >= 400;
    },
    stream: {
      write(message: string) {
        winston.info(message);
      },
    },
  });
  next();
};

export default {
  stderrStream,
  stdoutStream,
};