import mediaItemService from "../services/mediaItem.service.js";

class MediaItemController {

    createMediaItem = async (req, res) => {
        try {
            const { id: publicationId } = req.params
            const url = req.file.path
            const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video'
            const pic = await mediaItemService.createMediaItem({ publicationId, url, mediaType });
            res.status(201).send({ success: true, message: null, body: pic });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    deleteMediaItem = async (req, res) => {
        try {
            const { id } = req.params;
            await mediaItemService.deleteMediaItem(id);
            res.status(200).send({ success: true, message: null, body: null });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };
}

export default new MediaItemController();
