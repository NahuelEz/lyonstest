import _ from "lodash";
import { Publication, User, Profile, MediaItem, UnlockedContent, Subscription } from "../models/index.js";
import connection from "../connection/connection.js";

class PublicationService {

    getAllPublications = async (filters, currentUserId) => {
        const publications = await Publication.findAll({
            where: filters,
            include: [
                {
                    model: MediaItem,
                    as: 'mediaItems',
                    attributes: ['id', 'url', 'publicationId'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['profileComplete'],
                    include: [
                        {
                            model: Profile,
                            as: 'profile',
                            attributes: ['publicUserName', 'stageName', 'profileImage'],
                        },
                    ],
                },
            ],
        });

        if (filters && filters.userId && currentUserId && filters.userId != currentUserId) {
            const unlockedContents = await UnlockedContent.findAll({ where: { userId: currentUserId } });
            const subscriptions = await Subscription.findAll({ where: { subscriberUserId: currentUserId } });
            const activeSubscriptions = _.filter(subscriptions, { status: 'active' });
            const { userId } = filters;

            return _.map(publications, publication => {
                const isSubscribed = _.some(activeSubscriptions, suscription => suscription.creatorUserId == userId);
                const hasUnlocked = _.some(unlockedContents, content => content.publicationId == publication.id);

                // Si la publicación es tipo "basic" y el usuario no está suscrito, filtrar los mediaItems
                if (publication.publicationType === 'basic' && !isSubscribed) {
                    publication.dataValues.mediaItems = [];
                }

                // Si la publicación es tipo "token" y el usuario no la ha desbloqueado, filtrar los mediaItems
                if (publication.publicationType === 'token' && !hasUnlocked) {
                    publication.dataValues.mediaItems = [];
                }

                return publication;
            });
        } else {
            return publications;
        }
    };

    createPublication = async ({
        userId,
        title,
        description,
        type,
        mediaItems,
        cost
    }) => {
        const transaction = await connection.transaction();
        let mItems;
        try {
            const publication = await Publication.create(
                { userId, title, description, publicationType: type, cost },
                { transaction }
            );

            if (!_.isEmpty(mediaItems)) {
                mItems = await MediaItem.bulkCreate(
                    mediaItems.map((mediaItem, index) => ({
                        publicationId: publication.id,
                        url: mediaItem.url,
                        MediaItemListIndex: index,
                    })),
                    { transaction }
                );
            }

            const response = {
                id: publication.id,
                title: publication.title,
                description: publication.description,
                publicationType: type,
                publicationDate: publication.publicationDate,
                mediaItems: mItems ? mItems.map((media) => ({
                    id: media.id,
                    url: media.url,
                    mediaItemListIndex: media.mediaItemListIndex,
                })) : [],
            };

            await transaction.commit();
            return response;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error.message);
        }
    };

    getPublicationById = async (id) => {
        const publication = await Publication.findOne({
            where: { id },
            include: [{
                model: MediaItem,
                as: 'mediaItems',
                attributes: ['id', 'url', 'publicationId'],
            }],
        });

        if (!publication) throw new Error("Publication not found.");
        return publication;
    };

    deletePublication = async (id) => {
        const deleted = await Publication.destroy({ where: { id } });
        if (!deleted) throw new Error("Publication doesn't exist.");
    };
}

export default new PublicationService();
