import { DataTypes } from "sequelize";
import User from "./User.js";
import Publication from "./Publication.js";
import MediaItem from "./MediaItem.js";
import Profile from "./Profile.js";
import Subscription from "./Subscription.js";
import UnlockedContent from "./UnlockedContent.js";
import BillingInfo from "./BillingInfo.js";

// Define relaciones entre modelos
User.hasMany(Publication, { foreignKey: "userId" });
Publication.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(BillingInfo, { foreignKey: 'userId', onDelete: 'CASCADE' });
BillingInfo.belongsTo(User, { foreignKey: 'userId' });

Publication.hasMany(MediaItem, { foreignKey: "publicationId", as: "mediaItems" });
MediaItem.belongsTo(Publication, { foreignKey: "publicationId" });

User.belongsToMany(User, { through: { model: Subscription, unique: false }, as: "subscriptions", foreignKey: "subscriberUserId" }); // id del que se suscribe
User.belongsToMany(User, { through: { model: Subscription, unique: false }, as: "subscribers", foreignKey: "creatorUserId" }); // id del que recibe la suscripción

User.hasMany(UnlockedContent, { foreignKey: 'userId' });
UnlockedContent.belongsTo(User, { foreignKey: 'userId' });

Publication.hasMany(UnlockedContent, { foreignKey: 'publicationId' });
UnlockedContent.belongsTo(Publication, { foreignKey: 'publicationId' });

export { User, Publication, MediaItem, Subscription, Profile, UnlockedContent, BillingInfo };
