const express = require("express");
const { route } = require("./user");
const { getAllWeekEvents } = require("../OAuth");
const router = express.Router()

router.get("/", async (req, res) => {
    console.log(await getAllWeekEvents(req.user))
    res.render("home")
})

router.get("/settings", function (req, res) {
    res.render('settings')
})

router.get("/register", (req, res) => {
    res.render("register")
})
router.get("/contact", function (req, res) {
    res.render('contact')
})

module.exports = router;