import jwt from 'jsonwebtoken';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, cookieOptions);

    return token;
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};

export const clearAuthCookie = (res) => {
    res.cookie('jwt', '', { ...cookieOptions, maxAge: 0, expires: new Date(0) });
};
