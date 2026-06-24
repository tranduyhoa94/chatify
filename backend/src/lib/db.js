import mongoose from 'mongoose';

const getCache = () => {
    if (!global._mongooseCache) {
        global._mongooseCache = { conn: null, promise: null };
    }
    return global._mongooseCache;
};

const connectDB = async () => {
    const cached = getCache();

    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined');
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 10000,
            maxPoolSize: 10,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB connected');
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error('MongoDB connection failed:', error.message);
        if (process.env.VERCEL !== '1') {
            process.exit(1);
        }
        throw error;
    }
};

export default connectDB;
