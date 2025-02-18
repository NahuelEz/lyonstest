import { BillingInfo, Profile, Subscription, User } from "../models/index.js";
import { generateToken } from "../utils/auth.js";
import { verifyRecaptcha } from "../utils/recaptcha.js";

class UserService {
    login = async (email, password, recaptchaResponse) => {
        // TODO: Implement reCAPTCHA verification later
        // if (!recaptchaResponse) {
        //     throw new Error("Por favor, verifica que no eres un robot.");
        // }
        // const isValidRecaptcha = await verifyRecaptcha(recaptchaResponse);
        // if (!isValidRecaptcha) {
        //     throw new Error("Verificación reCAPTCHA fallida. Por favor, intenta de nuevo.");
        // }

        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error("Incorrect credentials");

        const validate = await user.validatePassword(password);
        if (!validate) throw new Error("Incorrect credentials");

        const payload = { 
            id: user.id,
            role: user.role,
            email: user.email
        };
        return generateToken(payload);
    };

    getAllModels = async () => {
        const models = await User.findAll({
            where: { role: "model" },
            attributes: ['id'],
            include: [{
                model: Profile,
                as: 'profile',
                attributes: ['stageName', 'publicUserName', 'profileImage', 'posterImage', 'bannerImage', 'userId'],
            }]
        })
        return models;
    };

    getUserById = async (id) => {
        const user = await User.findOne({
            where: { id },
            attributes: ["id", "email"],
        });
        if (!user) throw new Error("User not found.");
        return user;
    };

    createUser = async (email, password, confirmPassword, role, recaptchaResponse, isAdult, acceptedTerms) => {
        if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden.");
        
        // TODO: Implement reCAPTCHA verification later
        // if (!recaptchaResponse) {
        //     throw new Error("Por favor, verifica que no eres un robot.");
        // }
        // const isValidRecaptcha = await verifyRecaptcha(recaptchaResponse);
        // if (!isValidRecaptcha) {
        //     throw new Error("Verificación reCAPTCHA fallida. Por favor, intenta de nuevo.");
        // }

        if (!isAdult) throw new Error("Debes ser mayor de 18 años para registrarte.");
        if (!acceptedTerms) throw new Error("Debes aceptar los términos y condiciones.");

        const user = await User.create({ email, password, role });
        if (!user) throw new Error("Error creating the user.");
        return { id: user.id, email, role };
    };

    updateUser = async (id, password, confirmPassword) => {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const updated = await User.update(
            { password },
            { where: { id } }
        );
        if (!updated) throw new Error("Error updating the user.");
        return { id };
    };

    deleteUser = async (id) => {
        const deleted = await User.destroy({ where: { id } });
        if (!deleted) throw new Error("User doesn't exist.");
    };

    getUserInfo = async (id) => {
        const userInfo = await User.findOne({
            where: { id },
            attributes: ["id", "email", "profileComplete", "tokens", "status", "role"],
            include: [
                {
                    model: Profile,
                    as: "profile",
                },
                {
                    model: BillingInfo,
                    as: "billingInfo",
                }
            ],
        });
    
        if (!userInfo) throw new Error("User not found.");
        
        const subscribers = await Subscription.findAll({
            where: { creatorUserId: id }
        });

        const subscriptions = await Subscription.findAll({
            where: { subscriberUserId: id }
        });

        return {...userInfo.dataValues, subscribers, subscriptions};
    };
}

export default new UserService();
