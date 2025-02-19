import { Router } from 'express';
import modelController from '../controllers/model.controller.js';
import { validateUser } from '../middlewares/user.validator.js';

const modelRouter = Router();

// Ensure user is authenticated and is a model
const validateModel = async (req, res, next) => {
    try {
        console.log('Validating model role');
        if (req.user.role !== 'model') {
            console.log('User is not a model:', req.user.role);
            return res.status(403).send({ 
                success: false, 
                message: 'Access denied. User is not a model.', 
                body: null 
            });
        }
        console.log('User is a model, proceeding');
        next();
    } catch (error) {
        console.error('Error in validateModel middleware:', error);
        res.status(500).send({ 
            success: false, 
            message: 'Error validating user role', 
            body: null 
        });
    }
};

// Apply validateModel middleware to all routes
modelRouter.use(validateModel);

// Dashboard statistics
modelRouter.get('/stats', modelController.getModelStats);

// Recent subscribers
modelRouter.get('/subscribers/recent', modelController.getRecentSubscribers);

// Recent activities
modelRouter.get('/activities/recent', modelController.getRecentActivities);

// Top unlocked content
modelRouter.get('/content/top-unlocked', modelController.getTopUnlockedContent);

// Earnings overview
modelRouter.get('/earnings', modelController.getEarningsOverview);

export default modelRouter;
