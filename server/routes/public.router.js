import { Router } from 'express';
import publicationController from '../controllers/publication.controller.js';
import userController from '../controllers/user.controller.js';

const publicRouter = Router();

publicRouter.get('/publications', publicationController.getFreePublications);
publicRouter.get('/models', userController.getAllModels);

export default publicRouter;
