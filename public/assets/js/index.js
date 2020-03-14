document.addEventListener("DOMContentLoaded", () => {

    console.log("Document Ready");
    let tran_num = 0;
    let form_description = document.getElementById("form_description");
    let form_cost = document.getElementById("form_cost");
    let form_submit_button = document.getElementById("form_submit");

    form_submit_button.addEventListener("click", form_submit);

    async function form_submit(event) {
        event.preventDefault();
        document.getElementById("error").textContent = "";
        document.getElementById("success").textContent = "";
        console.log("Form submitted");
        const description = form_description.value || "desc_" + tran_num;
        const cost = parseInt(form_cost.value) || tran_num;
        console.log(description, cost);
        add_to_db(description, cost)
            .then(res => {
                return res.json();
            })
            .then((res) => {
                console.log("expense added to db");
                console.log(res);
                const transaction = [{
                    _id: "",
                    idb: "",
                    description: description,
                    cost: cost
                }];
                console.log(navigator.onLine);
                if (navigator.onLine) {
                    transaction[0]._id = res._id;
                    console.log(transaction[0]._id);
                    update_page();
                } else {
                    console.log(res);
                    transaction[0].idb = res;
                    console.log(transaction[0].idb);
                    add_to_table(transaction);
                    let total = document.getElementById("total_disp");
                    total.textContent = parseInt(total.textContent) + parseInt(cost);

                }

                const message = `Added: '${description} $${cost}' `;

                document.getElementById("success").textContent = message;
                tran_num++;

                return res;
            })
            .catch(err => {
                console.log(err);
                document.getElementById("error").textContent = "Expense not submitted";
                if (err.responseJSON && err.responseJSON.cost) {
                    document.getElementById("error").textContent = err.responseJSON.cost.message;
                } else if (err.responseJSON && err.responseJSON.description) {
                    document.getElementById("error").textContent = err.responseJSON.description.message;
                }
                tran_num++;
                return (err);
            });
    }

    function add_to_db(description, cost) {
        console.log(`add ${description} and ${cost} to db`);

        const transaction = {
            description: description,
            cost: cost
        };

        if (navigator.onLine) {
            console.log(transaction);
            return fetch("/api/add_expense", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transaction)
            });

        } else {
            console.log("Add expense to indexedDB");
            return new Promise((resolve) => {
                // eslint-disable-next-line no-undef
                const sr = save_record(transaction);
                console.log(sr);
                resolve(sr);
            });
        }
    }

    /**
   *
   * @param {array} result - array of objects containing id, cost, and description
   */
    function add_to_table(transactions) {
        if (transactions) {
            transactions.forEach((transaction) => {
                var table_row = document.createElement("tr");
                var col_description = document.createElement("td");
                var col_cost = document.createElement("td");
                var col_remove = document.createElement("td");
                var desc_text = document.createElement("p").textContent = transaction.description;
                var cost_text = document.createElement("p").textContent = transaction.cost;
                var remove_btn = document.createElement("i");

                remove_btn.classList += "fas fa-trash";
                remove_btn.setAttribute("data-id", transaction._id);
                remove_btn.setAttribute("data-idb", transaction.idb);

                col_description.append(desc_text);
                col_cost.append(cost_text);
                col_remove.append(remove_btn);

                table_row.append(col_description);
                table_row.append(col_cost);
                table_row.append(col_remove);
                document.getElementById("table_expenses").append(table_row);
            });
        }
    }



    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js")
                .then((reg) => {
                    console.log("Service worker registered.", reg);
                });
        });
    }

    function get_all_transactions() {
        if (navigator.onLine) {
            return get_all_transactions_from_mongodb();
        } else {
            return get_all_transactions_from_indexedDB();
        }
    }

    function get_all_transactions_from_mongodb() {
        return fetch("/api/expenses");
    }

    function get_all_transactions_from_indexedDB() {
        console.log("Get transactions from indexDB");
    }

    function update_page() {

        get_all_transactions()
            .then((res) => {
                console.log("get_all_transactions");
                return res.json();
            })
            .then((transactions) => {
                console.log(transactions);
                add_to_table(transactions);
                update_total(transactions);
            })
            .catch((err) => {
                console.log("Could not get transactions");
                console.log(err);
            });
    }

    function update_total(transactions) {
        const total = transactions.reduce((total, t) => {
            return total + parseInt(t.cost);
        }, 0);

        document.getElementById("total_disp").textContent = total;
    }


    update_page();

});