import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.post('/suscribe/:creatorUserId', subscriptionController.subscribe); // creatorUserId is the id of the user to subscribe to
// subscriptionRouter.delete('/unsubscribe/:creatorUserId', subscriptionController.unsubscribe); // creatorUserId is the id of the user to subscribe to

export default subscriptionRouter;
