import _ from "lodash";
import { Profile, User } from "../models/index.js";

class ProfileService {

    getProfile = async (userId) => {
        const profile = await Profile.findOne({
            where: { userId },
            include: [{
                model: User,
                attributes: ['id', 'email', 'role']
            }]
        });
        if (!profile) throw new Error("Profile not found");
        return profile;
    };

    createProfile = async (userId, profileData) => {
        try {
            const profile = await Profile.create(
                { userId, ...profileData }
            );

            await await User.update(
                { profileComplete: true },
                { where: { id: userId } }
            );
            return profile;
        } catch (error) {
            throw new Error(error);
        }
    };

    updateProfile = async (userId, profileData) => {
        const updated = await Profile.update(
            profileData,
            { where: { userId } }
        );
        if (!updated) throw new Error("Error updating the profile");
        const profile = await Profile.findOne({
            where: { userId }
        });
        return profile;
    };
}
export default new ProfileService();