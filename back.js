const express = require("express");
const mysql = require("mysql2");

const app = express();
const jsonParser = express.json();

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "buysDb",
    password: "psihustipusnimus"
});

app.use(express.static(__dirname + "/public"));


app.post("/updateMonth", jsonParser, function (req, res) {
    console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    const year = req.body.year;
    const month = req.body.month;
    const date = req.body.date;
    const name = req.body.name;
    const cost = req.body.cost;
    const type = req.body.type;
    pool.query("INSERT INTO buys (year, month, date, name, cost, type) VALUES (?,?,?,?,?,?)", [year, month, date, name, cost, type], function(err, data) {
        if(err) return console.log(err);
    });
});

app.get("/:year/:month", function (req,res){
    let fileContent;
    let filter = [req.params.year, req.params.month];
    pool.query("SELECT * FROM buys WHERE year=? AND month=?", filter, function (err,data) {
        if(err) return console.log(err);
            fileContent = JSON.stringify(data);
            console.log(fileContent);

    })
    res.send(fileContent)
})

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

