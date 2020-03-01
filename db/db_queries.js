const db = require("../models")
const db_queries = {
    get_expenses: function(){
        return db.expenses.find()
    },

    add_expense: function(description, cost){
        return db.expenses.create({
            description: description,
            cost: cost
        })
    }
}

module.exports = db_queries