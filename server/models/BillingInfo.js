import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class BillingInfo extends Model { }

BillingInfo.init(
    {
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        swiftCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerFullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ownerEmail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ownerAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bankCountry: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: connection,
        modelName: "billingInfo",
        timestamps: false,
    }
);


export default BillingInfo;

