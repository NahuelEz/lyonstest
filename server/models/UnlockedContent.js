import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class UnlockedContent extends Model { }

UnlockedContent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        publicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize: connection,
        modelName: "unlockedContent",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["userId", "publicationId"], // Índice único en la combinación de userId-publicationId
            },
        ],
    }
);

export default UnlockedContent;
