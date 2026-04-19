import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '7d'
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};
