const cron = require("node-cron");
const User = require("./DB/models/User");
const {
  getCourseWork,
  createSchoolPlannerCalendar,
  insertEvent,
} = require("./OAuth");
const mailgun = require("mailgun-js");
const { DateTime } = require("luxon");
const DOMAIN = "mail.underhallskostnader.se";
const mg = mailgun({
  apiKey: "59c93b4f06ff0e3547f28480731cc433-b2f5ed24-02be5ffe",
  domain: DOMAIN,
  host: "api.eu.mailgun.net",
});

cron.schedule(
  "5 8 * * 0",
  async () => {
    const users = await User.find({});
    users.forEach(async (user) => {
      try {
        const id = await createSchoolPlannerCalendar(user);
        const work = await getCourseWork(user);
        for (const item of work) {
          const start = {
            dateTime: DateTime.fromObject(item.dueDate)
              .minus({ days: 3, hours: 2 })
              .toJSDate(),
            timeZone: "Europe/Stockholm",
          };
          const end = {
            dateTime: DateTime.fromObject(item.dueDate)
              .minus({ days: 3 })
              .toJSDate(),
            timeZone: "Europe/Stockholm",
          };
          const data = {
            from: "info@mail.underhallskostnader.se",
            to: user.email,
            subject: "Ditt plugg är upplagt",
            text: "Hej! Allt ditt plugg den kommande vecka är inlagt i din kalender.",
          };
          mg.messages().send(data, (error, body) => {
            console.log("Sent mail to user");
          });

          await insertEvent(user, { id, start, end });
        }
      } catch (error) {
        const data = {
          from: "info@mail.underhallskostnader.se",
          to: user.email,
          subject: "Du måste logga in igen",
          text: "Hej! För att vi skall kunna få tillgång till din kalender så krävs du att du loggar in igen på http://localhost:3000/login",
        };
        mg.messages().send(data, (error, body) => {
          console.log(body);
        });
        console.log(error);
      }
    });
  },
  {
    timezone: "Europe/Stockholm",
  }
);
