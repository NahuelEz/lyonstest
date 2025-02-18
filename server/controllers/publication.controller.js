import publicationService from "../services/publication.service.js";
import _ from "lodash";

class PublicationController {
    getAllPublications = async (req, res) => {
        try {
            const currentUserId = req.user ? req.user.id : null;
            const publications = await publicationService.getAllPublications({}, currentUserId);
            res.status(200).send({ success: true, message: null, body: publications });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getUserPublications = async (req, res) => {
        const { id: userId } = req.params;
        const { user: { id: currentUserId } } = req;
        try {
            const publications = await publicationService.getAllPublications({ userId }, currentUserId);
            res.status(200).send({ success: true, message: null, body: publications });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getFreePublications = async (req, res) => {
        try {
            const publications = await publicationService.getAllPublications({ publicationType: 'free' });
            res.status(200).send({ success: true, message: null, body: publications });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    createPublication = async (req, res) => {
        try {
            const { user: { id: userId } } = req;
            const { title, description, type, cost } = req.body;

            const files = req.files.map(file => ({
                url: file.path,
                mediaType: file.mimetype.startsWith('image/') ? 'image' : 'video',
            }));

            if(type === 'token' && _.isEmpty(cost)) {
                throw new Error('Cost is required for token publications');
            }
            const publication = await publicationService.createPublication({
                userId,
                title,
                description,
                type,
                mediaItems: files,
                cost: type === 'token' ? cost : 0
            });

            res.status(200).send({ success: true, message: null, body: publication });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };


    getPublicationById = async (req, res) => {
        try {
            const { id } = req.params;
            const publication = await publicationService.getPublicationById(id);
            res.status(200).send({ success: true, message: null, body: publication });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    updatePublicationById = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, mediaItems } = req.body;
            const publication = await publicationService.updatePublicationById({ id, title, description, mediaItems });
            res.status(200).send({ success: true, message: null, body: publication });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    deletePublication = async (req, res) => {
        try {
            const { id } = req.params;
            await publicationService.deletePublication(id);
            res.status(200).send({ success: true, message: null, body: null });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };
}

export default new PublicationController();
