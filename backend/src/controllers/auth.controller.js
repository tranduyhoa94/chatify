import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username, email, password: hashedPassword });

        generateToken(newUser._id, res);
        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        generateToken(user._id, res);
        res.status(200).json({ message: 'Logged in successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
};

export const logout = async (_, res) => {
    try {
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = req.user;

        if (!username || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, { username, email }, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}