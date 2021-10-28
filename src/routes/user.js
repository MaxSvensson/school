const express = require("express");
const router = express.Router()
const passport = require("passport")
const auth = require("../middleware/auth")

require("../passport")

let UserService = require("../services/UserService");
UserService = new UserService()

router.post("/login/:token", async (req, res) => {
    const token = req.params.token
    console.log(token)
    try {
        const isVerified = await UserService.verifyLoginToken(token) 
        console.log(isVerified)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(400)
    }

})


router.get("/failed", (req, res) => {
    res.send("Failed")
})
router.get("/success", auth,(req, res) => {
    res.redirect("/")
})

router.get("/login", (req, res) => {
    if(req.user) return res.redirect("/")
    res.render("login")
})

router.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
        }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

    }
);

router.get("/logout", (req, res) => {
    req.session = null;
    req.logout();
    res.redirect("/login");
})

module.exports = router;