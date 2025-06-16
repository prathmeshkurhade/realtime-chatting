import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const databaseUrl = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,  
}))

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is runningn on port ${PORT}`);
})

mongoose
.connect(databaseUrl)
.then(() =>console.log('Connected to MongoDB'))
.catch((err) => console.log(err.message));
