document.addEventListener("DOMContentLoaded", () => {
    console.log("Document Ready")
    var form_description = document.getElementById("form_description")
    var form_cost = document.getElementById("form_cost")
    document.getElementById("form_submit").addEventListener("click", (event)=>{
        event.preventDefault()
        console.log("Form submitted")
        add_to_table(form_description.value, form_cost.value)

    })

    function add_to_table(description, cost){
        console.log(`add ${description} and ${cost} to table`)
        var table_row = document.createElement("tr")
        var col_description = document.createElement("td").textContent = description
        var col_cost = document.createElement("td").textContent = cost

        table_row.append(col_description, col_cost)
        document.getElementById("table_expenses").append(table_row)
    }
})