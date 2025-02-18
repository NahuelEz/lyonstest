import { DataTypes } from "sequelize";
import sequelize from "../connection/connection.js";
import User from "./User.js"; // Modelo de usuarios
import Payment from "./Payment.js";

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Relación con la tabla de usuarios
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tokens_added: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  payment_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Payment,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }
}, {
  timestamps: true, // Incluye createdAt y updatedAt automáticamente
  tableName: "transactions", // Asegura que el nombre de la tabla sea exacto
});

export default Transaction;
