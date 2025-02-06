import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";
import Publication from "./Publication.js";
import User from "./User.js";

class Comment extends Model {}

Comment.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        publicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Publication,
                key: "id",
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: connection,
        modelName: "comment",
        timestamps: false,
    }
);

export default Comment;
