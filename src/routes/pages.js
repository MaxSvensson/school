const express = require("express");
const { route } = require("./user");

const router = express.Router()

router.get('/home', function (req, res) {
    res.render('home');
});

router.get("/login", function (req, res) {
    res.render("login")
})

router.get("/settings", function (req, res) {
    res.render('settings')
})

router.get("/contact", function (req, res) {
    res.render('contact')
})

router.get("/setup", (req,res) => {
    res.render("setup")
})

module.exports = router;