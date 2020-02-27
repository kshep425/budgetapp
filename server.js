const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")
const compression = require("compression")
require("dotenv").config()
/*global process*/
/*eslint no-undef: "error"*/
const PORT = process.env.PORT || 8080

const app = express()

app.use(logger("dev"))

app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static("public"));


const DB = process.env.DB || "mongodb://localhost/budget"

const dbOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}
mongoose.connect(DB, dbOptions)

//routes
require("./routes/html_routes")(app)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`)
})