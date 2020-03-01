document.addEventListener("DOMContentLoaded", () => {
    console.log("Document Ready")
    let tran_num = 0
    let form_description = document.getElementById("form_description")
    let form_cost = document.getElementById("form_cost")

    document.getElementById("form_submit").addEventListener("click", async (event) => {
        event.preventDefault()
        document.getElementById("error").textContent = ""
        console.log("Form submitted")

        add_to_db(form_description.value || "desc_" + tran_num, form_cost.value || tran_num)
            .then((res) => {
                console.log("expense added to mongo db")
                console.log(res)

                add_to_table([{ _id: tran_num, description: form_description.value || "desc_" + tran_num, cost: form_cost.value || tran_num }])

                tran_num++

                return res
            })
            .catch(err => {
                console.log(err)
                // err = JSON.parse(err.response)
                console.log(err.responseJSON.cost.message)
                document.getElementById("error").textContent = "Expense not submitted"
                if (err.responseJSON && err.responseJSON.cost){
                    document.getElementById("error").textContent = err.responseJSON.cost.message
                } else if (err.responseJSON && err.responseJSON.description){
                    document.getElementById("error").textContent = err.responseJSON.description.message
                }
                tran_num++
                return (err)
            })

    })

    /**
     *
     * @param {array} result - array of objects containing id, cost, and description
     */
    function add_to_table(transactions) {
        if (transactions) {
            transactions.forEach((transaction) => {

                console.log(`add ${transaction._id}: ${transaction.description} and ${transaction.cost} to table`)
                var table_row = document.createElement("tr")
                var col_description = document.createElement("td")
                var col_cost = document.createElement("td")
                var col_remove = document.createElement("td")
                var desc_text = document.createElement("p").textContent = transaction.description
                var cost_text = document.createElement("p").textContent = transaction.cost
                var remove_btn = document.createElement("i")
                remove_btn.classList += "fas fa-trash"
                remove_btn.setAttribute("data-id", transaction._id)

                col_description.append(desc_text)
                col_cost.append(cost_text)
                col_remove.append(remove_btn)

                table_row.append(col_description)
                table_row.append(col_cost)
                table_row.append(col_remove)
                document.getElementById("table_expenses").append(table_row)
            })
        }
    }

    function add_to_db(description, cost) {
        console.log(`add ${description} and ${cost} to db`)
        if (navigator.onLine) {

            return $.ajax({
                method: "POST",
                url: "/api/add_expense",
                data: {
                    description: description,
                    cost: cost
                }
            })

        } else {
            console.log("Add expense to indexedDB")
            return new Promise(() => { })
        }

    }
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js")
                .then((reg) => {
                    console.log("Service worker registered.", reg)
                })
        })
    }

    function get_all_transactions() {
        if (navigator.onLine) {
            return get_all_transactions_from_mongodb()
        } else {
            return get_all_transactions_from_indexedDB()
        }
    }

    function get_all_transactions_from_mongodb() {
        return fetch("/api/expenses")
    }

    function get_all_transactions_from_indexedDB() {
        console.log("Get transactions from indexDB")
    }

    get_all_transactions()
        .then((res)=>{
            console.log("get_all_transactions")
            return res.json()
        })
        .then((transactions) =>{
            console.log(transactions)
            add_to_table(transactions)
        })
        .catch((err) => {
            console.log("Could not get transactions")
            console.log(err)
        })

})