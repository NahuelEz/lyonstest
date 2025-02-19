import { Subscription, User, Profile, Publication, UnlockedContent } from "../models/index.js";
import { Op } from "sequelize";

class ModelService {
    getModelStats = async (userId) => {
        try {
            console.log('Getting stats for user:', userId);

            // Get active subscribers count
            const activeSubscribers = await Subscription.count({
                where: {
                    creatorUserId: userId,
                    expiresIn: {
                        [Op.gt]: new Date()
                    }
                }
            });
            console.log('Active subscribers:', activeSubscribers);

            // Get total earnings from subscriptions
            const subscriptionEarnings = await Subscription.sum('cost', {
                where: {
                    creatorUserId: userId
                }
            });
            console.log('Subscription earnings:', subscriptionEarnings);

            // Get total unlocked content count
            const unlockedContentCount = await UnlockedContent.count({
                include: [{
                    model: Publication,
                    where: { userId }
                }]
            });
            console.log('Unlocked content count:', unlockedContentCount);

            const stats = {
                activeSubscribers,
                subscriptionEarnings: subscriptionEarnings || 0,
                unlockedContentCount
            };
            console.log('Returning stats:', stats);
            return stats;
        } catch (error) {
            console.error('Error in getModelStats:', error);
            throw new Error(error.message);
        }
    };

    getRecentSubscribers = async (userId) => {
        try {
            console.log('Getting recent subscribers for user:', userId);
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
            console.log('Found subscribers:', subscribers.length);
            return subscribers;
        } catch (error) {
            console.error('Error in getRecentSubscribers:', error);
            throw new Error(error.message);
        }
    };

    getRecentActivities = async (userId) => {
        try {
            console.log('Getting recent activities for user:', userId);
            
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
            console.log('Recent subscriptions:', recentSubscriptions.length);

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
            console.log('Recent unlocks:', recentUnlocks.length);

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

            console.log('Total activities:', activities.length);
            return activities;
        } catch (error) {
            console.error('Error in getRecentActivities:', error);
            throw new Error(error.message);
        }
    };

    getTopUnlockedContent = async (userId) => {
        try {
            console.log('Getting top unlocked content for user:', userId);
            const publications = await Publication.findAll({
                where: { userId },
                include: [{
                    model: UnlockedContent,
                    attributes: ['id', 'cost']
                }],
                order: [[UnlockedContent, 'id', 'DESC']],
                limit: 6
            });
            console.log('Found publications:', publications.length);

            const result = publications.map(pub => ({
                ...pub.toJSON(),
                unlockCount: pub.unlockedContents.length,
                tokensEarned: pub.unlockedContents.reduce((sum, unlock) => sum + unlock.cost, 0)
            }));
            console.log('Processed publications:', result.length);
            return result;
        } catch (error) {
            console.error('Error in getTopUnlockedContent:', error);
            throw new Error(error.message);
        }
    };

    getEarningsOverview = async (userId) => {
        try {
            console.log('Getting earnings overview for user:', userId);
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
            console.log('Subscription earnings:', subscriptionEarnings);

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
            console.log('Content earnings:', contentEarnings);

            const result = {
                subscriptionEarnings: subscriptionEarnings || 0,
                contentEarnings: contentEarnings || 0,
                totalEarnings: (subscriptionEarnings || 0) + (contentEarnings || 0)
            };
            console.log('Total earnings:', result);
            return result;
        } catch (error) {
            console.error('Error in getEarningsOverview:', error);
            throw new Error(error.message);
        }
    };
}

export default new ModelService();
