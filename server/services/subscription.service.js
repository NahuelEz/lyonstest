import _ from "lodash";
import { Subscription } from "../models/index.js";
import userService from "./user.service.js";
import profileService from "./profile.service.js";

class SubscriptionService {
    createSubscription = async ({ creatorUserId, subscriberUserId, expiresIn }) => {
        try {

            const user = await userService.getUserInfo(subscriberUserId);
            const creatorUser = await userService.getUserInfo(creatorUserId);

            const creatorType = creatorUser.get("role");
            const creatorProfileStatus = creatorUser.get("profileComplete");

            if (creatorType !== "model" || !creatorProfileStatus) throw new Error("The creator is not a model or has an incomplete profile");

            const creatorProfile = await profileService.getProfile(creatorUserId);
            const cost = await creatorProfile.get("basicSubscriptionCost");
            const tokens = await user.get("tokens");

            if (tokens < cost) throw new Error("Not enough tokens");
            const subs = await Subscription.create({
                creatorUserId,
                subscriberUserId,
                cost,
                expiresIn
            });
            if (!subs) throw new Error("Error creating the media content");
            user.decrement("tokens", { by: cost });
            return subs;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // deleteSubscription = async (id) => {
    //    TODO: Implement this method
    // };
}

export default new SubscriptionService();
