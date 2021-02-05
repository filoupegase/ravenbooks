const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json()); // parses incoming requests with JSON payloads


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port);
});

//create connection to database
const db = mysql.createPool({
    host: process.env.DB_HOST, //localhost
    user: process.env.DB_USER, //root
    password: process.env.DB_PASSWORD, //password
    database: process.env.DB, //ravenbook
    insecureAuth : true
});

app.get("/reviews", (req, res) => {
    db.query("SELECT * FROM ravenbook.book_review", (err, result) => {
        if (err) {
            console.log(err);
        } else res.send(result);
    });
});

app.post("/reviews", (req, res) => {
    const insertQuery = "INSERT INTO ravenbook.book_review SET ?";
    db.query(insertQuery, req.body, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Un nouveau livre à ete ajouté à la base de donnée !");
        }
    });
});

app.put("/reviews", (req, res) => {
    const updateQuery =
        "UPDATE book_review SET book_review = ?, book_rating = ? WHERE id = ?";
    db.query(
        updateQuery,
        [req.body.book_review, req.body.book_rating, req.body.id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/reviews/:id", (req, res) => {
    db.query(
        "DELETE FROM book_review WHERE id = ?",
        req.params.id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});


