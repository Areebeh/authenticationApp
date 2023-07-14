require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();


// console.log(process.env.SECRET);

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

// database

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret : secret , encryptedFields : ["password"]});

const userCollection = new mongoose.model("user", userSchema);

// const userDocument = new userCollection({
//     email : 
//     password :
// });

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUserDocument = new userCollection({
        email: req.body.username,
        password: req.body.password
    });
    newUserDocument.save()
    .then(result => {
        res.render("secrets");
    }).catch(err =>{
        console.log(err);
    });
});

app.post("/login",function(req,res){
    const userName = req.body.username ;
    const password = req.body.password ;
    userCollection.findOne({email:userName})
    .then(result =>{
        if(result){
            if(result.password === password ){
                res.render("secrets");
            }
        }
    }).catch(err =>{
        console(err);
    });
});

app.listen(3000, function () {
    console.log("server is started at portal : 3000");
});