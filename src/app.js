const express = require("express")
const userRoute = require("./routes/user");
const pageRoute = require("./routes/pages")
var exphbs  = require('express-handlebars');

const passport = require('passport');
const cookieSession = require('cookie-session');
const auth = require("./middleware/auth")

require("./passport")
require("./DB/Mongoose")

const app = express();
const hbs = exphbs.create({ /* config */ });

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.set('views', __dirname + '/views');
app.use('/Js', express.static(__dirname + '/public/Js'));
app.use('/Css', express.static(__dirname + '/public/Css'));


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

app.use("/", userRoute)

app.use(auth)
app.use("/", pageRoute)


app.listen(3000, () => {
    console.log("Server is up")
})

