import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import authRoutes from './src/routes/authRoutes';
import spamRoutes from './src/routes/spamRoutes';
import searchRoutes from './src/routes/searchRoutes';

import contextMiddleWare from './src/middleware/context';

import loggerStream from './src/utils/logger/morgan';
const { stderrStream, stdoutStream } = loggerStream;
import errorHandlers from './src/utils/errorHandler';
const { notFoundErrorHandler, unhandledRejectionHandler, uncaughtExceptionHandler, errorDecorator, finalErrorHandler } = errorHandlers;

const app: Application = express();
const PORT = 3000;

app.set('env', process.env.NODE_ENV);

app.use(helmet());

app.use(stderrStream, stdoutStream);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(contextMiddleWare)

// Routes
app.use('/auth', authRoutes);
app.use('/spam', spamRoutes);
app.use('/search', searchRoutes);

// Healthcheck endpoint
app.get('/healthcheck', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Working fine',
  });
});

// handles 404 routes
app.use(notFoundErrorHandler);

//handles exceptions and rejections
process.on('unhandledRejection', unhandledRejectionHandler);
process.on('uncaughtException', uncaughtExceptionHandler);

//decorate and responds to error
app.use(errorDecorator);
app.use(finalErrorHandler);


try {
  app.listen(PORT, (): void => {
    console.log(`Server up and running on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
