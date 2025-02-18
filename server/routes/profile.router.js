import { Router } from 'express';
import ProfileController from '../controllers/profile.controller.js';
import { constructProfileData } from '../middlewares/profile.constructor.js';
import upload from '../middlewares/multer.js';


const profileRouter = Router();

// Get logged in user's profile
profileRouter.get('/', ProfileController.getProfile);

// Get profile by userId
profileRouter.get('/:userId', ProfileController.getProfileById);

profileRouter.post('/create',
    upload.fields([
        { name: 'frontDocumentFile', maxCount: 1 },
        { name: 'backDocumentFile', maxCount: 1 },
        { name: 'videoDocumentFile', maxCount: 1 },
        { name: 'profileImageFile', maxCount: 1 },
        { name: 'posterImageFile', maxCount: 1 },
        { name: 'bannerImageFile', maxCount: 1 }
    ]),
    (req, res, next) => {
        console.log('Solicitud recibida en /create');
        console.log('Body:', req.body);
        console.log('Files:', req.files);
        next();
    },
    constructProfileData,
    ProfileController.createProfile
);

profileRouter.put('/update',
    upload.fields([
        { name: 'frontDocumentFile', maxCount: 1 },
        { name: 'backDocumentFile', maxCount: 1 },
        { name: 'videoDocumentFile', maxCount: 1 },
        { name: 'profileImageFile', maxCount: 1 },
        { name: 'posterImageFile', maxCount: 1 },
        { name: 'bannerImageFile', maxCount: 1 }
    ]),
    constructProfileData,
    ProfileController.updateProfile
);

export default profileRouter;
