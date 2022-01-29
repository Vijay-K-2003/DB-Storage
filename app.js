require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/userDB');
}

mongoose.connect('mongodb://localhost:27017/userDB')
    .catch(error => handleError(error));;

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    linkedIn: String,
    twitter: String,
    github: String
});

const User = mongoose.model('User', userSchema);

User.createCollection()
    .then(() => console.log("Collection created"));

mongoose.connection.on('error', err => {
    logError(err);
});



const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // res.render("index.html");
    res.render("./index.html");
});

app.post("/", (req, res) => {
    console.log(req.body);
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        linkedIn: req.body.linkedIn,
        twitter: req.body.twitter,
        github: req.body.github
    });
    user.save()
        .then(() => {
            res.redirect("/dashboard");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

app.get('/dashboard', (req, res) => {
    console.log("User Successfully Created");
    res.send("<h1>Done</h1>");
});

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("listening on port 3000");
});