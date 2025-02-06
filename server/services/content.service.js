import _ from "lodash";
import { UnlockedContent } from "../models/index.js";
import userService from "./user.service.js";
import publicationService from "./publication.service.js";

class ContentService {
    unlockContent = async ({ userId, publicationId }) => {
        try {
            const user = await userService.getUserInfo(userId);
            const availableTokens = await user.get("tokens");

            const publication = await publicationService.getPublicationById(publicationId);
            const cost = await publication.get("cost");

            if (availableTokens < cost) throw new Error("Not enough tokens");

            const subs = await UnlockedContent.create({
                userId,
                cost,
                publicationId
            });

            if (!subs) throw new Error("Error creating the media content");
            user.decrement("tokens", { by: cost });

            return subs;
        } catch (error) {
            error.message = error.original.sqlMessage == `Duplicate entry '1-4' for key 'unlocked_contents_user_id_publication_id'` ? "Content already unlocked" : error.message;
            throw new Error(error.message);
        }
    };

    // deleteContent = async (id) => {
    //    TODO: Implement this method
    // };
}

export default new ContentService();
