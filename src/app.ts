import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import globalErrorHandler from './errors/globalErrorHandler';

const app: Application = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://project-update-frontend.vercel.app',
];

// ✅ CORS SAFE CONFIG
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ IMPORTANT: preflight safe (NO '*')
app.options(/.*/, cors());

app.use(express.json());

// routes
app.use('/api/v1', router);

// health check
app.get('/', (req: Request, res: Response) => {
  res.send('Eco Spark Hub Server Running 🚀');
});

// 404 handler (NO '*' EVER)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// global error
app.use(globalErrorHandler);

export default app;