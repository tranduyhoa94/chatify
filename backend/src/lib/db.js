import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        if (process.env.VERCEL !== '1') {
            process.exit(1);
        }
        throw error;
    }
};

export default connectDB;
