import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  const userId = req.query.userId;

  try {
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      order: [["transaction_date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error al obtener transacciones:", error.message);
    res.status(500).json({ success: false, message: "Error al obtener transacciones" });
  }
};
