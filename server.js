const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/fontawesome", express.static(__dirname + "/node_modules/@fortawesome/fontawesome-free/"));
app.use(express.static("public"));



const DB = process.env.DB || "mongodb://localhost/transaction";

const dbOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};
console.log(DB);
mongoose.connect(DB, dbOptions);

//routes
require("./routes/html_routes")(app);
require("./routes/api_routes")(app);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});