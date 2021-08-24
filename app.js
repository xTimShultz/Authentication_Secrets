//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require ("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisoursecretkey.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] }); // Must be added to schema before model instantiated

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/logout", function(req, res) {
    res.redirect("/");
});

app.post("/register", function(req, res) {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        };
    });
});

app.post("/login", function(req, res) {
    const userName = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email: userName},
        function (err, foundUser) {
            if (err) {
                console.log(err);
            } else if (foundUser) {
                if (foundUser.password === userPassword) {
                    res.render("secrets");
                } else {
                    console.log("Failed authentication");
                };
            } else {
                console.log("Failed authentication");
            };
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});