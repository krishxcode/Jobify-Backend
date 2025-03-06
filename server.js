import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
app.use(cookieParser());

// ✅ CORS Configuration
const corsOptions = {
  origin: "*",
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get("/", (req, res) => {
  res.send("Backend is running!");
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
// app.use('/api/users', userRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB & Start Server
connectDB()
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});