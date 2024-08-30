import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

connectDB();

const app = express();

app.use( cors() );
app.use( express.json() );

app.use( '/api/auth', authRoutes );
app.use( '/api/users', userRoutes );
app.use( '/api/appointments', appointmentRoutes );

app.use( errorHandler );

export default app;