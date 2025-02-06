import { DataTypes, Model } from "sequelize";
import connection from "../connection/connection.js";

class Subscription extends Model { }

Subscription.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        suscribedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        expiresIn: {
            type: DataTypes.DATE,
            defaultValue: () => {
                const now = new Date();
                now.setMonth(now.getMonth() + 1); // Sumar 1 mes
                return now;
            }  // Default expires in 30d
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.VIRTUAL, 
            get() {
                const now = new Date();
                return now < this.expiresIn ? "active" : "expired";
            }
        }
    },
    {
        sequelize: connection,
        modelName: "subscription",
        timestamps: false,
    }
);

export default Subscription;
