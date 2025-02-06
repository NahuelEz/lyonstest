import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import publicationController from '../controllers/publication.controller.js';

const userRouter = Router();

userRouter.post('/register', UserController.createUser);
userRouter.post('/login', UserController.login); 
userRouter.post('/billinginfo', UserController.addBillingInfo);
userRouter.put('/billinginfo', UserController.updateBillingInfo);

userRouter.get('/me', UserController.me); 
userRouter.get('/:id', UserController.getUserById);

userRouter.put('/:id', UserController.updateUser); 
userRouter.delete('/:id', UserController.deleteUser);


userRouter.get('/:id/publications', publicationController.getUserPublications);
export default userRouter;
