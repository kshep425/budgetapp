document.addEventListener("DOMContentLoaded", () => {

    console.log("Document Ready");
    let tran_num = 0;
    let form_description = document.getElementById("form_description");
    let form_cost = document.getElementById("form_cost");
    let form_category = document.getElementById("form_category");

    let expense_button = document.getElementById("expense_btn");
    let income_button = document.getElementById("income_btn");
    expense_button.addEventListener("click", form_submit);
    income_button.addEventListener("click", form_submit);
    console.log(form_category);

    async function form_submit(event) {
        event.preventDefault();
        console.log(event.target.value);
        document.getElementById("error").textContent = "";
        document.getElementById("success").textContent = "";
        console.log("Form submitted");
        const description = form_description.value || "desc_" + tran_num;
        const cost = parseFloat(form_cost.value) || tran_num;
        const category = form_category.value;
        const type = event.target.value;
        console.log(description, cost, type, category);
        if (cost === 0) {
            document.getElementById("error").textContent = "Please enter a number > 0";
            tran_num++;
            return;
        } else {
            document.getElementById("error").textContent = "";
        }

        add_to_db(description, cost, type, category)
            .then(res => {
                if (typeof res === "function"){
                    return res.json();
                }
                else {
                    return res;
                }
            })
            .then((res) => {
                console.log("transaction added to db");
                console.log(res);
                const transaction = [{
                    _id: "",
                    idb: "",
                    description,
                    cost,
                    type,
                    category
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
                    console.log(transaction);
                    let total = document.getElementById("total_disp");
                    if (transaction[0].type === "expense"){
                        total.textContent = parseFloat(total.textContent) - parseFloat(transaction[0].cost);
                    } else {
                        total.textContent = parseFloat(total.textContent) +  parseFloat(transaction[0].cost);
                    }
                    console.log(total.textContent);

                }

                const message = `Added: '${description} ${(type==="expense") ? "-": ""} $${cost} ${type} ${category}' `;

                document.getElementById("success").textContent = message;
                tran_num++;

                return res;
            })
            .catch(err => {
                console.log(err);
                document.getElementById("error").textContent = "Transaction not submitted";
                if (err.responseJSON && err.responseJSON.cost) {
                    document.getElementById("error").textContent = err.responseJSON.cost.message;
                } else if (err.responseJSON && err.responseJSON.description) {
                    document.getElementById("error").textContent = err.responseJSON.description.message;
                }
                tran_num++;
                return (err);
            });
    }

    function add_to_db(description, cost, type, category) {
        console.log(`add ${description} ${cost} ${type} and ${category} to db`);

        const transaction = {
            description: description,
            cost: cost,
            type,
            category
        };

        if (navigator.onLine) {
            console.log(transaction);
            return fetch("/api/add_transaction", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transaction)
            });

        } else {
            console.log("Add transaction to indexedDB");
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
   * @param {array} result - array of objects containing id, cost, description, and category
   */
    function add_to_table(transactions) {
        if (transactions) {
            transactions.forEach((transaction) => {
                var table_row = document.createElement("tr");
                var col_description = document.createElement("td");
                var col_cost = document.createElement("td");
                var col_category = document.createElement("td");
                var col_remove = document.createElement("td");
                var desc_text = document.createElement("p").textContent = transaction.description;
                var cost_text = document.createElement("p").textContent = `${(transaction.type==="expense") ? "-": ""} ${transaction.cost}`;
                var category_text = document.createElement("p").textContent = transaction.category;
                var remove_btn = document.createElement("i");

                remove_btn.classList += "fas fa-trash";
                remove_btn.setAttribute("data-id", transaction._id);
                remove_btn.setAttribute("data-idb", transaction.idb);
                remove_btn.addEventListener("click", remove);

                col_description.append(desc_text);
                col_cost.append(cost_text);
                col_category.append(category_text);
                col_remove.append(remove_btn);

                table_row.append(col_description);
                table_row.append(col_cost);
                table_row.append(col_category);
                table_row.append(col_remove);

                document.getElementById("table_transactions").prepend(table_row);

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
        return fetch("/api/transactions");
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
                document.getElementById("table_transactions").textContent = "";
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
            if (t.type === "expense"){
                return parseFloat(total) - parseFloat(t.cost);
            } else {
                return parseFloat(total) + parseFloat(t.cost);
            }
        }, 0);

        document.getElementById("total_disp").textContent = total;
    }

    function remove(event){
        event.preventDefault();
        console.log(event);
        console.log(event.target);
        console.log(event.target.id);
        remove_item(event.target.id);
    }

    function remove_item(id) {
        console.log("Remove Item: " + id);
    }

    update_page();

});