var path = require("path");

function html_routes(app){
    app.get("/", (req, res)=>{

        console.log("Open home page");
        console.log(req.body);

        res.sendFile(path.join(__dirname + "/../public/index.html"));

    });
}

module.exports = html_routes;