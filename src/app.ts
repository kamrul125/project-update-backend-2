import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import globalErrorHandler from './errors/globalErrorHandler';

const app: Application = express();

// ✅ পরিষ্কার এবং নিরাপদ CORS কনফিগারেশন
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://project-update-frontend.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes মাউন্ট করা হচ্ছে
app.use('/api/v1', router);

// সার্ভার স্ট্যাটাস চেক
app.get('/', (req: Request, res: Response) => {
  res.send('Eco Spark Hub Server Running 🚀');
});

// ✅ ৪-০৪ হ্যান্ডলার (ওয়াইল্ডকার্ড এরর এড়াতে শুধু app.use ব্যবহার করুন)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// গ্লোবাল এরর হ্যান্ডলার
app.use(globalErrorHandler);

export default app;