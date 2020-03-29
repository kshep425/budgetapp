const db_queries = require("../db/db_queries");
const api_routes = function (app) {
    app.get("/api/transactions", function (req, res) {
        console.log(req.body);
        db_queries.get_transactions()
            .then(result => {
                console.log("=============Get transactions=============");
                console.log(result);
                return res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json(err);
            });
    });

    app.post("/api/add_transaction", (req, res) => {
        console.log("add transaction");
        console.log(req.body);
        db_queries.add_transaction(req.body.description, req.body.cost, req.body.type, req.body.category)
            .then(result => {
                console.log("++++++++++++++Add transaction+++++++++++++");
                console.log(result);
                return res.status(200).json(result);
            })
            .catch((err) => {
                console.log("--------------Error---------------");
                console.log(err.errors);
                return res.status(400).json(err.errors);
            });
    });

    app.post("/api/transaction/bulk", (req, res) =>{
        db_queries.bulk_add(req.body)
            .then(result =>{
                console.log("_____________Bulk Add_________________");
                console.log(result);
                return res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err.errors);
                return res.status(400).json(err.errors);
            });
    });
};

module.exports = api_routes;
