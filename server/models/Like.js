import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class Like extends Model {}

Like.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        publicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: "like",
        timestamps: false,
    }
);

// Relacionar modelos después de inicializar todos
export const associateLikeModel = (Publication, User) => {
    Like.belongsTo(Publication, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Like.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
};

export default Like;
