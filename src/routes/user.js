const express = require("express");
const router = express.Router()
const passport = require("passport")
const auth = require("../middleware/auth")

let UserService = require("../services/UserService");
UserService = new UserService()

require("../passport")

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
                ['email', 'profile', 'https://www.googleapis.com/auth/calendar.events.readonly']
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

router.get("/logout", async (req, res) => {
    const id = req.user.id
    if(!id) throw new Error()
    try {
        req.session = null;
        req.logout();
        await UserService.setUserLogout(id)
        res.redirect("/login");    
    } catch (error) {
        res.redirect("login")
    }   
})



module.exports = router;