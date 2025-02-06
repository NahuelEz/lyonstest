import { verifyToken } from "../utils/auth.js";
import _ from "lodash"

const isRegisterPath = (path, method) => {
    return path === '/api/users/register' && method === 'POST';
}

const isLoginPath = (path, method) => {
    return path === '/api/users/login' && method === 'POST';
}

const isPublicPath = (path) => {
    return _.startsWith(path, '/api/public/');
}

export const validateUser = async (req, res, next) => {
    const currentPath = req.baseUrl + req.path
    const { method } = req
    const authHeader = req.headers.authorization
    let token;

    if (isRegisterPath(currentPath, method) || isLoginPath(currentPath, method) || isPublicPath(currentPath)) return next();

    try {
        token = authHeader ?
            _.split(authHeader, ' ')[1]
            : req.cookies.token

        const user = verifyToken(token);

        if (!user) throw new Error("Inválid credentials.")

        req.user = user;
        next();

    } catch (error) {
        res.status(401).send({ success: false, message: error.message, body: null });
    }
};