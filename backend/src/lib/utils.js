import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

    return token;
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export const decodeToken = (token) => {
    return jwt.decode(token);
}