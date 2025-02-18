import Publication from "./Publication.js";
import User from "./User.js";
import Like from "./Like.js";
import Comment from "./Comment.js";
import UnlockedContent from "./UnlockedContent.js";
import Profile from "./Profile.js";
import Subscription from "./Subscription.js";

export const associateModels = () => {
    // User associations
    User.hasOne(Profile, { foreignKey: "userId", as: "profile" });
    User.hasMany(Publication, { foreignKey: "userId" });
    User.hasMany(Like, { foreignKey: "userId", onDelete: "CASCADE" });
    User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
    User.hasMany(UnlockedContent, { foreignKey: "userId", onDelete: "CASCADE" });
    
    // Subscription associations
    User.hasMany(Subscription, { 
        foreignKey: "creatorUserId",
        as: "subscribers"
    });
    User.hasMany(Subscription, { 
        foreignKey: "subscriberUserId",
        as: "subscriptions"
    });
    Subscription.belongsTo(User, { 
        foreignKey: "creatorUserId",
        as: "creator"
    });
    Subscription.belongsTo(User, { 
        foreignKey: "subscriberUserId",
        as: "subscriber"
    });

    // Profile associations
    Profile.belongsTo(User, { foreignKey: "userId" });

    // Publication associations
    Publication.belongsTo(User, { foreignKey: "userId" });
    Publication.hasMany(Like, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Publication.hasMany(Comment, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Publication.hasMany(UnlockedContent, { foreignKey: "publicationId", onDelete: "CASCADE" });

    // Like associations
    Like.belongsTo(Publication, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Like.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

    // Comment associations
    Comment.belongsTo(Publication, { foreignKey: "publicationId", onDelete: "CASCADE" });
    Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

    // UnlockedContent associations
    UnlockedContent.belongsTo(Publication, { foreignKey: "publicationId", onDelete: "CASCADE" });
    UnlockedContent.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
};
