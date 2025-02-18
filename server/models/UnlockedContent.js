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
        },
        unlockDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'expired'),
            defaultValue: 'active',
            allowNull: false,
        }
    },
    {
        sequelize: connection,
        modelName: "unlockedContent",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["userId", "publicationId"],
            },
        ],
    }
);

export default UnlockedContent;
