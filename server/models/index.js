import { DataTypes } from "sequelize";
import User from "./User.js";
import Publication from "./Publication.js";
import MediaItem from "./MediaItem.js";
import Profile from "./Profile.js";
import Subscription from "./Subscription.js";
import UnlockedContent from "./UnlockedContent.js";
import BillingInfo from "./BillingInfo.js";
import Like from "./Like.js";
import Comment from "./Comment.js";

// Define relaciones entre modelos
User.hasMany(Publication, { foreignKey: "userId" });
Publication.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(BillingInfo, { foreignKey: "userId", onDelete: "CASCADE" });
BillingInfo.belongsTo(User, { foreignKey: "userId" });

Publication.hasMany(MediaItem, { foreignKey: "publicationId", as: "mediaItems" });
MediaItem.belongsTo(Publication, { foreignKey: "publicationId" });

User.belongsToMany(User, { through: { model: Subscription, unique: false }, as: "subscriptions", foreignKey: "subscriberUserId" }); // id del que se suscribe
User.belongsToMany(User, { through: { model: Subscription, unique: false }, as: "subscribers", foreignKey: "creatorUserId" }); // id del que recibe la suscripción

User.hasMany(UnlockedContent, { foreignKey: "userId" });
UnlockedContent.belongsTo(User, { foreignKey: "userId" });

Publication.hasMany(UnlockedContent, { foreignKey: "publicationId" });
UnlockedContent.belongsTo(Publication, { foreignKey: "publicationId" });

Publication.hasMany(Like, { foreignKey: "publicationId", onDelete: "CASCADE" });
Like.belongsTo(Publication, { foreignKey: "publicationId" });

Publication.hasMany(Comment, { foreignKey: "publicationId", onDelete: "CASCADE" });
Comment.belongsTo(Publication, { foreignKey: "publicationId" });

User.hasMany(Like, { foreignKey: "userId", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

// Agregar una exportación por defecto
export default function associateModels() {
    // Aquí puedes configurar todas las relaciones si necesitas más personalización
    console.log("Modelos asociados correctamente.");
}

export { User, Publication, MediaItem, Subscription, Profile, UnlockedContent, BillingInfo, Like, Comment };
