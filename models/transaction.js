const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    payment_method: {
      type: String,
      required: true,
    },
    payment_account_number: {
      type: String,
      required: true,
    },
    event_name: {
      type: String,
      required: true,
    },
    event_host: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model('transactions', TransactionSchema);

module.exports = TransactionModel;
