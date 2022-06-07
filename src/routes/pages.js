const express = require("express");
const { route } = require("./user");
const { getAllWeekEvents, getCoursesId, getCourseWork } = require("../OAuth");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("home", {
    name: req.user.name,
  });
});

module.exports = router;
