const db = require("../models");
const db_queries = {
    get_transactions: function(){
        console.log(db);
        return db.Transaction.find();
    },

    add_transaction: function(description, cost, type, category){
        return db.Transaction.create({
            description,
            cost,
            type,
            category
        });
    },

    bulk_add: function(transactions) {
        console.log("bulk add");
        console.log(transactions);
        return db.Transaction.insertMany(transactions);
    }
};

module.exports = db_queries;