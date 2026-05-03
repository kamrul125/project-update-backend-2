import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes'; // আপনার index.ts ফাইলটি ইম্পোর্ট করুন
import globalErrorHandler from './errors/globalErrorHandler';

const app: Application = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.0.102:3000',
    'http://192.168.0.102:3001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API রাউট রেজিস্টার
app.use('/api/v1', router);

// স্বাস্থ্য পরীক্ষা রুট
app.get('/', (req: Request, res: Response) => {
  res.send('Eco Spark Hub Server Running 🚀');
});

// ৪-০৪ রাউট
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// গ্লোবাল এরর হ্যান্ডলার
app.use(globalErrorHandler);

export default app;