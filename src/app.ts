import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import config from './app/config';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [`${config.domain_fontend}`], credentials: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('SuccessFully run server');
});

//Not Found
app.use(notFound);

//golbal Error Handeling
app.use(globalErrorHandler);

export default app;
