import modelService from "../services/model.service.js";

class ModelController {
    getModelStats = async (req, res) => {
        try {
            const { user: { id: userId } } = req;
            const stats = await modelService.getModelStats(userId);
            res.status(200).send({ success: true, message: null, body: stats });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getRecentSubscribers = async (req, res) => {
        try {
            const { user: { id: userId } } = req;
            const subscribers = await modelService.getRecentSubscribers(userId);
            res.status(200).send({ success: true, message: null, body: subscribers });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getRecentActivities = async (req, res) => {
        try {
            const { user: { id: userId } } = req;
            const activities = await modelService.getRecentActivities(userId);
            res.status(200).send({ success: true, message: null, body: activities });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getTopUnlockedContent = async (req, res) => {
        try {
            const { user: { id: userId } } = req;
            const content = await modelService.getTopUnlockedContent(userId);
            res.status(200).send({ success: true, message: null, body: content });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    getEarningsOverview = async (req, res) => {
        try {
            const { user: { id: userId } } = req;
            const earnings = await modelService.getEarningsOverview(userId);
            res.status(200).send({ success: true, message: null, body: earnings });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };
}

export default new ModelController();
