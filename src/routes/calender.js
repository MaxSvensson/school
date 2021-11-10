const express = require("express");
const router = express.Router()
const passport = require("passport")
const auth = require("../middleware/auth")

let UserService = require("../services/UserService");
UserService = new UserService()

let CalenderService = require("../services/CalenderService");
CalenderService = new CalenderService()

require("../passport")

router.get("/", async (req, res) => {
    try {
        const response = await CalenderService.getWeekEvents(req.user.id)
        res.status(200).send()
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;