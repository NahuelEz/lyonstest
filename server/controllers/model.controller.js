import modelService from "../services/model.service.js";

class ModelController {
    getModelStats = async (req, res) => {
        try {
            console.log('getModelStats called');
            const { user: { id: userId } } = req;
            console.log('User ID:', userId);
            
            const stats = await modelService.getModelStats(userId);
            console.log('Stats retrieved:', stats);
            
            res.status(200).send({ success: true, message: null, body: stats });
        } catch (error) {
            console.error('Error in getModelStats controller:', error);
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getRecentSubscribers = async (req, res) => {
        try {
            console.log('getRecentSubscribers called');
            const { user: { id: userId } } = req;
            console.log('User ID:', userId);
            
            const subscribers = await modelService.getRecentSubscribers(userId);
            console.log('Subscribers retrieved:', subscribers.length);
            
            res.status(200).send({ success: true, message: null, body: subscribers });
        } catch (error) {
            console.error('Error in getRecentSubscribers controller:', error);
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getRecentActivities = async (req, res) => {
        try {
            console.log('getRecentActivities called');
            const { user: { id: userId } } = req;
            console.log('User ID:', userId);
            
            const activities = await modelService.getRecentActivities(userId);
            console.log('Activities retrieved:', activities.length);
            
            res.status(200).send({ success: true, message: null, body: activities });
        } catch (error) {
            console.error('Error in getRecentActivities controller:', error);
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getTopUnlockedContent = async (req, res) => {
        try {
            console.log('getTopUnlockedContent called');
            const { user: { id: userId } } = req;
            console.log('User ID:', userId);
            
            const content = await modelService.getTopUnlockedContent(userId);
            console.log('Content retrieved:', content.length);
            
            res.status(200).send({ success: true, message: null, body: content });
        } catch (error) {
            console.error('Error in getTopUnlockedContent controller:', error);
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getEarningsOverview = async (req, res) => {
        try {
            console.log('getEarningsOverview called');
            const { user: { id: userId } } = req;
            console.log('User ID:', userId);
            
            const earnings = await modelService.getEarningsOverview(userId);
            console.log('Earnings retrieved:', earnings);
            
            res.status(200).send({ success: true, message: null, body: earnings });
        } catch (error) {
            console.error('Error in getEarningsOverview controller:', error);
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };
}

export default new ModelController();
