import {Request, Response, NextFunction} from 'express';

import logger from './logger/winston';

interface IError extends Error {
  options: any;
  statusCode: number;
}

const exitProcess = () => {
  process.exit(1);
};

const notFoundErrorHandler = ({ originalUrl }: Request, res: Response, next: NextFunction) => {
  res.statusCode = 404;
  next(new Error('404: Route not Found. Please check and correct the route.'));
}

const unhandledRejectionHandler = (reason: string, p: any) => {
  logger.error({ reason, message: 'Unhandled Rejection at Promise', p });
};

const uncaughtExceptionHandler = (err: Error) => {
  logger.error(err);
  exitProcess();
};

const errorDecorator = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const serverErrorWithStack = err.stack !== undefined;

  const originalMessage = err.message || null;

  const options = {
    decorate: {
      isDeveloperError: serverErrorWithStack,
      originalUrl: req.originalUrl,
      method: req.method,
      ip: req.ip,
      originalMessage,
    },
    data: { stack: err.stack || 'n/a' },
  };
  err.options = options;
  next(err);
};

const finalErrorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);
  if (err) logger.error('error" ', err.message)

  return res.status(res.statusCode || 500).json({message: err.message});
};

export default {
  exitProcess,
  errorDecorator,
  finalErrorHandler,
  notFoundErrorHandler,
  uncaughtExceptionHandler,
  unhandledRejectionHandler,
};
