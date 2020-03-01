const mongoose = require("mongoose")
const Schema = mongoose.Schema

const expensesSchema = new Schema({
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
        min: [.01, "Cost has to be more than 0"],

    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Expense = mongoose.model("Expense", expensesSchema)

module.exports = Expense