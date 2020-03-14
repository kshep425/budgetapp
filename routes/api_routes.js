const db_queries = require("../db/db_queries");
const api_routes = function (app) {
    app.get("/api/expenses", function (req, res) {
        // console.log(req.body);
        db_queries.get_expenses()
            .then(result => {
                // console.log("++++++++++++++Get Expenses+++++++++++++");
                // console.log(result);
                res.json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    });

    app.post("/api/add_expense", (req, res) => {
        console.log("add expense");
        console.log(req.body);
        db_queries.add_expense(req.body.description, req.body.cost)
            .then(result => {
                console.log("++++++++++++++Add Expense+++++++++++++");
                console.log(result);

                res.send(result);
            })
            .catch((err) => {
                console.log("--------------Error---------------");
                console.log(err.errors);
                res.status(400).json(err.errors);
            });
    });

    app.post("/api/transaction/bulk", (req, res) =>{
        db_queries.bulk_add(req.body)
            .then(result =>{
                //console.log("_____________Bulk Add_________________");
                //console.log(result);
                res.json(result);
            })
            .catch((err) => {
                console.log(err.errors);
                res.status(400).json(err.errors);
            });
    });
};

module.exports = api_routes;
