import Publication from "./Publication.js";
import User from "./User.js";
import Like from "./Like.js";
import Comment from "./Comment.js";

// Asociar los modelos
export const associateModels = () => {
    // Publicación pertenece a un Usuario
    Publication.belongsTo(User, { foreignKey: "userId" });

    // Publicación tiene muchos Likes y Comentarios
    Publication.hasMany(Like, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Publication.hasMany(Comment, { foreignKey: "publicationId", onDelete: "CASCADE" });

    // Like pertenece a una Publicación y un Usuario
    Like.belongsTo(Publication, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Like.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

    // Comment pertenece a una Publicación y un Usuario
    Comment.belongsTo(Publication, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
};
