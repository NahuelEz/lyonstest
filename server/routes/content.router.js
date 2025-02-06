import { Router } from 'express';
import contentController from '../controllers/content.controller.js';

const contentRouter = Router();

contentRouter.post('/publications/:publicationId/unlock', contentController.unlockContent);


export default contentRouter;
