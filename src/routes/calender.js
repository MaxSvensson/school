const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth")

let UserService = require("../services/UserService");
UserService = new UserService()

let CalenderService = require("../services/CalenderService");
CalenderService = new CalenderService()


router.get("/", async (req, res) => {
    try {
        const response = await CalenderService.getWeekEvents(req.user.id)
        console.log(response)
        res.status(200).send()
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;