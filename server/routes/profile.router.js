import { Router } from 'express';
import ProfileController from '../controllers/profile.controller.js';
import { constructProfileData } from '../middlewares/profile.constructor.js';
import upload from '../middlewares/multer.js';


const profileRouter = Router();

// Solo el owner puede editar, obtener o actualizar su perfil. El userId lo sacamos del req.userId
profileRouter.get('/', ProfileController.getProfile);

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
