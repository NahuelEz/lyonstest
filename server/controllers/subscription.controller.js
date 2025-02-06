import subscriptionService from "../services/subscription.service.js";

class SubscriptionController {

    subscribe = async (req, res) => {
        try {
            const { creatorUserId } = req.params
            const { user: { id: userId } } = req;
            const { cost, expiresIn } = req.body;
            const subsc = await subscriptionService.createSubscription({ creatorUserId, subscriberUserId: userId, cost, expiresIn });
            res.status(201).send({ success: true, message: null, body: subsc });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    };

    // unsubscribe = async (req, res) => {
    //    TODO: Implement this method if neccesary
    // };
}

export default new SubscriptionController();
