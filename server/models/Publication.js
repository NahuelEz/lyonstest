import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class Publication extends Model {}

Publication.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        publicationType: {
            type: DataTypes.ENUM("free", "basic", "token"),
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        publicationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: {
                    msg: "Invalid date.",
                },
            },
        },
    },
    {
        sequelize: connection,
        modelName: "publication",
        timestamps: false,
    }
);

export default Publication;
