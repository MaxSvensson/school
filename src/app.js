const express = require("express");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user");
const calenderRoute = require("./routes/calender");
const pageRoute = require("./routes/pages");
var exphbs = require("express-handlebars");
const auth = require("./middleware/auth");

require("./DB/Mongoose");

const app = express();
const hbs = exphbs.create({
  /* config */
});

require("./cron");

app.use(cookieParser());
app.use(express.json());
app.set("views", __dirname + "/views");
app.use("/Js", express.static(__dirname + "/public/Js"));
app.use("/Css", express.static(__dirname + "/public/Css"));
app.use("/img", express.static(__dirname + "/public/img"));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/", userRoute);

app.use(auth);
app.use("/api/calender", calenderRoute);
app.use("/", pageRoute);

app.listen(3000, () => {
  console.log("Server is up");
});
