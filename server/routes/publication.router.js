import { Router } from 'express';
import publicationController from '../controllers/publication.controller.js';
import MediaItemController from '../controllers/mediaItem.controller.js';
import upload from '../middlewares/multer.js';

const publicationRouter = Router();

publicationRouter.post('/', upload.array('files', 10), publicationController.createPublication);
// publicationRouter.get('/', publicationController.getAllPublications); // por ahora lo deshabilitamos por que no tiene caso de uso claro
// publicationRouter.get('/:id', publicationController.getPublicationById); // por ahora lo deshabilitamos por que no tiene caso de uso claro > todavía no filtra por unlocked por eso
publicationRouter.put('/:id', publicationController.updatePublicationById);
publicationRouter.delete('/:id', publicationController.deletePublication);

publicationRouter.post('/:id/mediaItems/add', upload.single('file'), MediaItemController.createMediaItem);
publicationRouter.delete('/mediaItems/:id', MediaItemController.deleteMediaItem);

export default publicationRouter;
