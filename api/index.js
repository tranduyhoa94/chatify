import connectDB from '../backend/src/lib/db.js';
import app from '../backend/src/app.js';

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch {
        res.status(503).json({ message: 'Database unavailable' });
    }
});

export default app;
