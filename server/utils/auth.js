import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET } from '../../config/config.js';

export const generateSecureKey = (length) => {
    return crypto.randomBytes(length).toString('hex');
}

const secretKey = JWT_SECRET || generateSecureKey(32);

export const generateToken = (payload, expiresIn = '2d') => {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
}

export const verifyToken = (token) => {
    try {
        const verify = jwt.verify(token, secretKey);
        return verify;
    } catch (error) {
        throw new Error('Invalid token');
    }
}