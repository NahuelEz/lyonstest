import _ from "lodash";
import { BillingInfo } from "../models/index.js";

class BillingInfoService {
    addBillingInfo = async (billingInfo) => {
        try {
            const bInfo = await BillingInfo.create(billingInfo);
            return bInfo;
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    };

    updateBillingInfo = async ({ userId, billingInfo }) => {
        const updated = await BillingInfo.update(
            billingInfo,
            { where: { userId } }
        );
        if (!updated) throw new Error("Error updating the user.");
        return updated;
    };
}

export default new BillingInfoService();
