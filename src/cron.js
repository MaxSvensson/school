const cron = require("node-cron");

cron.schedule("0 5 * * 1", () => {}, {
  timezone: "Europe/Stockholm",
});
