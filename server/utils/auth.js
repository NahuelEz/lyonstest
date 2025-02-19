import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET } from '../../config/config.js';

export const generateSecureKey = (length) => {
    console.log('Generating secure key of length:', length);
    const key = crypto.randomBytes(length).toString('hex');
    console.log('Secure key generated successfully');
    return key;
}

const secretKey = JWT_SECRET || generateSecureKey(32);
console.log('Using JWT secret key:', secretKey ? 'From config' : 'Generated');

export const generateToken = (payload, expiresIn = '2d') => {
    try {
        console.log('Generating token for payload:', {
            ...payload,
            password: payload.password ? '[REDACTED]' : undefined
        });
        
        const token = jwt.sign(payload, secretKey, { expiresIn });
        console.log('Token generated successfully');
        return token;
    } catch (error) {
        console.error('Error generating token:', {
            message: error.message,
            stack: error.stack
        });
        throw new Error('Failed to generate authentication token');
    }
}

export const verifyToken = (token) => {
    try {
        console.log('Verifying token...');
        if (!token) {
            console.error('No token provided');
            throw new Error('Token is required');
        }

        const decoded = jwt.verify(token, secretKey);
        console.log('Token verified successfully:', {
            userId: decoded.id,
            role: decoded.role,
            exp: new Date(decoded.exp * 1000).toISOString()
        });

        // Check if token is expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTimestamp) {
            console.error('Token has expired:', {
                expiry: new Date(decoded.exp * 1000).toISOString(),
                current: new Date(currentTimestamp * 1000).toISOString()
            });
            throw new Error('Token has expired');
        }

        return decoded;
    } catch (error) {
        console.error('Token verification failed:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });

        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token format');
        } else {
            throw new Error('Token verification failed: ' + error.message);
        }
    }
}
