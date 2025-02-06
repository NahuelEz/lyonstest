import contentService from "../services/content.service.js";

class ContentController {

    unlockContent = async (req, res) => {
        try {
            const { publicationId } = req.params
            const { user: { id: userId } } = req;
            const uCont = await contentService.unlockContent({ userId, publicationId });
            res.status(201).send({ success: true, message: null, body: uCont });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    // unsubscribe = async (req, res) => {
    //    TODO: Implement this method if neccesary
    // };
}

export default new ContentController();
