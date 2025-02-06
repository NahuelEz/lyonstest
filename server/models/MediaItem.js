import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import _ from "lodash";

class MediaItem extends Model { }

MediaItem.init(
    {
        publicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {
                    msg: 'The URL contains an invalid format, please enter a valid URL with http/https protocol.',
                    protocols: ['http,https'],
                    require_protocol: true
                }
            }
        },
        mediaType: {
            type: DataTypes.ENUM('image', 'video'),
            allowNull: false,
        },
        mediaListIndex: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        sequelize: connection,
        modelName: "mediaItem",
        timestamps: true,
        hooks: {
            async beforeCreate(mediaItem) {
                if (_.isNil(mediaItem.mediaListIndex)) {
                    const lastMediaItem = await MediaItem.findOne({
                        where: { publicationId: mediaItem.publicationId },
                        order: [['mediaListIndex', 'DESC']],
                    });

                    mediaItem.mediaListIndex = lastMediaItem ? lastMediaItem.mediaListIndex + 1 : 1;
                }
            },
        }
    }
);

export default MediaItem;
