import { Router } from 'express';
import modelController from '../controllers/model.controller.js';

const modelRouter = Router();

// Ensure user is authenticated and is a model
const validateModel = async (req, res, next) => {
    try {
        console.log('Validating model access:', {
            userId: req.user.id,
            role: req.user.role,
            path: req.path
        });

        if (!req.user) {
            console.error('No user object in request');
            return res.status(401).send({ 
                success: false, 
                message: 'Authentication required', 
                body: null 
            });
        }

        if (req.user.role !== 'model') {
            console.error('User is not a model:', {
                userId: req.user.id,
                role: req.user.role
            });
            return res.status(403).send({ 
                success: false, 
                message: 'Access denied. User is not a model.', 
                body: null 
            });
        }

        console.log('Model access validated successfully');
        next();
    } catch (error) {
        console.error('Error in validateModel middleware:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).send({ 
            success: false, 
            message: 'Error validating model access', 
            body: null 
        });
    }
};

// Apply validateModel middleware to all routes
modelRouter.use(validateModel);

// Dashboard statistics
modelRouter.get('/stats', async (req, res, next) => {
    console.log('Handling /stats request for model:', req.user.id);
    return modelController.getModelStats(req, res, next);
});

// Recent subscribers
modelRouter.get('/subscribers/recent', async (req, res, next) => {
    console.log('Handling /subscribers/recent request for model:', req.user.id);
    return modelController.getRecentSubscribers(req, res, next);
});

// Recent activities
modelRouter.get('/activities/recent', async (req, res, next) => {
    console.log('Handling /activities/recent request for model:', req.user.id);
    return modelController.getRecentActivities(req, res, next);
});

// Top unlocked content
modelRouter.get('/content/top-unlocked', async (req, res, next) => {
    console.log('Handling /content/top-unlocked request for model:', req.user.id);
    return modelController.getTopUnlockedContent(req, res, next);
});

// Earnings overview
modelRouter.get('/earnings', async (req, res, next) => {
    console.log('Handling /earnings request for model:', req.user.id);
    return modelController.getEarningsOverview(req, res, next);
});

// Error handling middleware
modelRouter.use((err, req, res, next) => {
    console.error('Error in model router:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        userId: req.user?.id
    });

    res.status(500).send({
        success: false,
        message: 'Internal server error in model endpoint',
        body: null
    });
});

export default modelRouter;
