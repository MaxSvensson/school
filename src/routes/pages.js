const express = require("express");
const { route } = require("./user");

const router = express.Router()

router.get('/', function (req, res) {
    res.render('home');
});

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/settings", (req, res) => {
    res.render('settings')
})

module.exports = router;