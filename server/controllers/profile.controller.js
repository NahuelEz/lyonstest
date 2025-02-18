import profileService from "../services/profile.service.js";

class ProfileController {
    getProfile = async (req, res) => {
        try {
            const { user } = req;
            const userId = user.id;
            const profile = await profileService.getProfile(userId);
            res.status(200).send({ success: true, message: null, body: profile });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    }

    createProfile = async (req, res) => {
        try {
            const { user } = req;
            const userId = user.id;
            const profile = await profileService.createProfile(userId, req.profileData);
            res.status(201).send({ success: true, message: null, body: profile });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    }

    updateProfile = async (req, res) => {
        try {
            const { user } = req;
            const userId = user.id;
            const profile = await profileService.updateProfile(userId, req.profileData);
            res.status(200).send({ success: true, message: null, body: profile });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    }

    getProfileById = async (req, res) => {
        try {
            const { userId } = req.params;
            const profile = await profileService.getProfile(userId);
            res.status(200).send({ success: true, message: null, body: profile });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message, body: null });
        }
    }
}

export default new ProfileController();
