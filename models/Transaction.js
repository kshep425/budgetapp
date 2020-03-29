const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    description: {
        type: String,
        required: [
            true,
            "Please enter a description"
        ]
    },
    cost: {
        type: Number,
        required: [
            true,
            "Please enter a number"
        ],
        min: [.01, "Amount has to be more than 0"],
    },
    type: {
        type: String
    },
    category: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;