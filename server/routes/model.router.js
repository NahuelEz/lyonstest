import { Router } from 'express';
import modelController from '../controllers/model.controller.js';

const modelRouter = Router();

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
