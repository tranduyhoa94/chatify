import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('/{*splat}', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html')));
}

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();