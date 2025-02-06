import _ from "lodash";
import { MediaItem, Publication } from "../models/index.js";

class MediaItemService {
    createMediaItem = async ({ publicationId, url, mediaType }) => {
        try {
            if (!url) {
                throw new Error(`Please provide a image url`);
            }
            const publicationExists = await Publication.findByPk(publicationId);
            if (!publicationExists) {
                throw new Error(`Publication with id ${publicationId} does not exist`);
            }

            const mediaItem = await MediaItem.create({
                publicationId,
                url,
                mediaType
            });

            if (!mediaItem) throw new Error("Error creating the media content");
            return mediaItem;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteMediaItem = async (id) => {
        const deleted = await MediaItem.destroy({ where: { id } });
        if (!deleted) throw new Error("Media content doesn't exist");
    };
}

export default new MediaItemService();
