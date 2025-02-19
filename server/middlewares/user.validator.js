import { verifyToken } from "../utils/auth.js";
import _ from "lodash"

const isRegisterPath = (path, method) => {
    const isRegister = path === '/api/users/register' && method === 'POST';
    console.log('Is register path:', isRegister, { path, method });
    return isRegister;
}

const isLoginPath = (path, method) => {
    const isLogin = path === '/api/users/login' && method === 'POST';
    console.log('Is login path:', isLogin, { path, method });
    return isLogin;
}

const isPublicPath = (path) => {
    const isPublic = _.startsWith(path, '/api/public/');
    console.log('Is public path:', isPublic, { path });
    return isPublic;
}

export const validateUser = async (req, res, next) => {
    try {
        const currentPath = req.baseUrl + req.path;
        const { method } = req;
        const authHeader = req.headers.authorization;
        
        console.log('Validating request:', {
            path: currentPath,
            method,
            hasAuthHeader: !!authHeader
        });

        // Skip validation for public routes
        if (isRegisterPath(currentPath, method) || isLoginPath(currentPath, method) || isPublicPath(currentPath)) {
            console.log('Skipping validation for public route');
            return next();
        }

        // Check for auth header
        if (!authHeader) {
            console.error('No authorization header found');
            throw new Error('No authorization header provided');
        }

        // Extract token
        const token = _.split(authHeader, ' ')[1];
        if (!token) {
            console.error('No token found in authorization header');
            throw new Error('No token provided');
        }

        console.log('Verifying token...');
        const user = verifyToken(token);

        if (!user) {
            console.error('Token verification failed');
            throw new Error('Invalid token');
        }

        console.log('Token verified successfully:', {
            userId: user.id,
            role: user.role
        });

        // Set user in request
        req.user = user;
        next();

    } catch (error) {
        console.error('Authentication error:', {
            message: error.message,
            stack: error.stack
        });

        res.status(401).send({ 
            success: false, 
            message: error.message || 'Authentication failed', 
            body: null 
        });
    }
};
