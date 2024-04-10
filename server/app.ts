import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import authRoutes from './src/routes/authRoutes';
import spamRoutes from './src/routes/spamRoutes';
import searchRoutes from './src/routes/searchRoutes';

import contextMiddleWare from './src/middleware/context';

const app: Application = express();
const PORT = 3000;

app.set('env', process.env.NODE_ENV);

app.use(helmet());

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

try {
  app.listen(PORT, (): void => {
    console.log(`Server up and running on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
