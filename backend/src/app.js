import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import connectDB from './lib/db.js';

dotenv.config();

const app = express();

const normalizeOrigin = (url) => url?.replace(/\/$/, '') ?? '';

const getAllowedOrigins = () => [
    process.env.CLIENT_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : null,
]
    .filter(Boolean)
    .map(normalizeOrigin);

app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const allowed = getAllowedOrigins();
        const normalizedOrigin = normalizeOrigin(origin);

        if (allowed.length === 0) {
            return callback(null, origin);
        }

        if (allowed.includes(normalizedOrigin)) {
            return callback(null, origin);
        }

        console.error('CORS blocked:', normalizedOrigin, '| allowed:', allowed);
        return callback(new Error(`Origin ${normalizedOrigin} not allowed by CORS`));
    },
    credentials: true,
}));
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        await connectDB();
        res.json({
            ok: true,
            db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        });
    } catch (error) {
        res.status(503).json({
            ok: false,
            db: 'disconnected',
            error: error.message,
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

// Static frontend — only when running as a single Node server (Render/Railway), not on Vercel
const isVercel = process.env.VERCEL === '1';
if (process.env.NODE_ENV === 'production' && !isVercel) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('/{*splat}', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'))
    );
}

export default app;
