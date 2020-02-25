const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const DB = process.env.DB || "mongodb://localhost/budget"

dbOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}
mongoose.connect(DB, dbOptions);

//routes


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`)
})