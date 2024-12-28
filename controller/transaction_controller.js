const TransactionModel = require('../models/transaction');
const UserModel = require('../models/user');

exports.findTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skip = (page - 1) * limit;

    const count = await TransactionModel.countDocuments({ user_id: userId });

    const transactions = await TransactionModel.find({ user_id: userId })
      .limit(Number(limit))
      .skip(Number(skip));

    res.status(200).json({
      message: 'User transactions fetched successfully',
      data: transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch user transactions', error });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const {
      userId,
      amount,
      paymentMethod,
      paymentAccountNumber,
      eventName,
      eventHost,
    } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTransaction = await TransactionModel.create({
      user_id: userId,
      amount: amount,
      payment_method: paymentMethod,
      payment_account_number: paymentAccountNumber,
      event_name: eventName,
      event_host: eventHost,
    });

    res.status(200).json({
      message: 'Transaction created successfully',
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction', error });
  }
};
