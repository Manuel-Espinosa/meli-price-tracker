import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import tokenManager from './config/tokenManager.js';
import startPriceTrackingJob from './jobs/priceTrackingJob.js';


dotenv.config();

connectDB();
tokenManager.refreshAccessToken();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

startPriceTrackingJob();

const PORT = process.env.CONTAINER_APP_PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
