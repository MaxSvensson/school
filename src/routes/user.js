const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth")
const { getGoogleAuthURL, getGoogleUser } = require("../OAuth");
const User = require("../DB/models/User");

let UserService = require("../services/UserService");
UserService = new UserService()


router.get("/failed", (req, res) => {
    res.send("Failed")
})
router.get("/success", (req, res) => {
    res.redirect("/")
})

router.get("/login", (req, res) => {
    if(req.user) return res.redirect("/")
    res.render("login")
})

router.get("/google", (req, res) => {

    try {
        const authUrl = getGoogleAuthURL();
        res.redirect(authUrl)

    } catch (error) {
        res.redirect("/login")        
    }

})

router.get("/google/callback", async (req, res) => {
    try {
        let googleUser = await getGoogleUser(req.query.code)

        if(!googleUser) throw new Error("No user was found")

        let user = await UserService.getUser(googleUser.id);
        
        if(!user) {
            user = new User({
                name: googleUser.name,
                email: googleUser.email,
                currentlyLoggedIn: true,
                googleId: googleUser.id,
                tokens: googleUser.tokens
            })

            user.save(e => {
                console.log(e)
                if(e) throw new Error("Error creating user")
            });
        } else {
             user.tokens = googleUser.tokens
        }

        const token = await UserService.CreateSessionToken(user);

        res.cookie("token", token, { maxAge: 900000, httpOnly: true });
        
        res.status(200).redirect("/")
    } catch (error) {
        console.log(error)
        res.status(400).redirect("/login")
    }
})

// router.get("/logout", async (req, res) => {
//     const id = req.user.id
//     if(!id) throw new Error()
//     try {
//         req.session = null;
//         req.logout();
//         await UserService.setUserLogout(id)
//         res.redirect("/login");    
//     } catch (error) {
//         res.redirect("login")
//     }   
// })



module.exports = router;