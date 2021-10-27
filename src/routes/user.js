const express = require("express");
const router = express.Router()

let UserController = require("../controllers/UserController");
UserController = new UserController()

router.post("/login/:token", async (req, res) => {
    const token = req.params.token
    console.log(token)
    try {
        const isVerified = await UserController.verifyLoginToken(token) 
        console.log(isVerified)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(400)
    }

})

module.exports = router;