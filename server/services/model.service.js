import { Subscription, User, Profile, Publication, UnlockedContent } from "../models/index.js";
import { Op } from "sequelize";

class ModelService {
    getModelStats = async (userId) => {
        try {
            // Get active subscribers count
            const activeSubscribers = await Subscription.count({
                where: {
                    creatorUserId: userId,
                    expiresIn: {
                        [Op.gt]: new Date()
                    }
                }
            });

            // Get total earnings from subscriptions
            const subscriptionEarnings = await Subscription.sum('cost', {
                where: {
                    creatorUserId: userId
                }
            });

            // Get total unlocked content count
            const unlockedContentCount = await UnlockedContent.count({
                include: [{
                    model: Publication,
                    where: { userId }
                }]
            });

            return {
                activeSubscribers,
                subscriptionEarnings: subscriptionEarnings || 0,
                unlockedContentCount
            };
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getRecentSubscribers = async (userId) => {
        try {
            const subscribers = await Subscription.findAll({
                where: {
                    creatorUserId: userId
                },
                include: [{
                    model: User,
                    as: 'subscriber',
                    attributes: ['id', 'email'],
                    include: [{
                        model: Profile,
                        attributes: ['stageName', 'profileImage']
                    }]
                }],
                order: [['suscribedAt', 'DESC']],
                limit: 10
            });

            return subscribers;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getRecentActivities = async (userId) => {
        try {
            // Get recent subscriptions
            const recentSubscriptions = await Subscription.findAll({
                where: {
                    creatorUserId: userId
                },
                include: [{
                    model: User,
                    as: 'subscriber',
                    attributes: ['id'],
                    include: [{
                        model: Profile,
                        attributes: ['stageName']
                    }]
                }],
                order: [['suscribedAt', 'DESC']],
                limit: 5
            });

            // Get recent content unlocks
            const recentUnlocks = await UnlockedContent.findAll({
                include: [{
                    model: Publication,
                    where: { userId },
                    attributes: ['title']
                }, {
                    model: User,
                    attributes: ['id'],
                    include: [{
                        model: Profile,
                        attributes: ['stageName']
                    }]
                }],
                order: [['createdAt', 'DESC']],
                limit: 5
            });

            // Combine and format activities
            const activities = [
                ...recentSubscriptions.map(sub => ({
                    type: 'subscription',
                    description: `${sub.subscriber.profile.stageName} se ha suscrito a tu contenido`,
                    createdAt: sub.suscribedAt
                })),
                ...recentUnlocks.map(unlock => ({
                    type: 'unlock',
                    description: `${unlock.user.profile.stageName} ha desbloqueado "${unlock.publication.title}"`,
                    createdAt: unlock.createdAt
                }))
            ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

            return activities;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getTopUnlockedContent = async (userId) => {
        try {
            const publications = await Publication.findAll({
                where: { userId },
                include: [{
                    model: UnlockedContent,
                    attributes: ['id', 'cost']
                }],
                order: [[UnlockedContent, 'id', 'DESC']],
                limit: 6
            });

            return publications.map(pub => ({
                ...pub.toJSON(),
                unlockCount: pub.unlockedContents.length,
                tokensEarned: pub.unlockedContents.reduce((sum, unlock) => sum + unlock.cost, 0)
            }));
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getEarningsOverview = async (userId) => {
        try {
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

            // Get subscription earnings for current month
            const subscriptionEarnings = await Subscription.sum('cost', {
                where: {
                    creatorUserId: userId,
                    suscribedAt: {
                        [Op.gte]: firstDayOfMonth
                    }
                }
            });

            // Get content unlock earnings for current month
            const contentEarnings = await UnlockedContent.sum('cost', {
                include: [{
                    model: Publication,
                    where: { 
                        userId,
                        createdAt: {
                            [Op.gte]: firstDayOfMonth
                        }
                    }
                }]
            });

            return {
                subscriptionEarnings: subscriptionEarnings || 0,
                contentEarnings: contentEarnings || 0,
                totalEarnings: (subscriptionEarnings || 0) + (contentEarnings || 0)
            };
        } catch (error) {
            throw new Error(error.message);
        }
    };
}

export default new ModelService();
