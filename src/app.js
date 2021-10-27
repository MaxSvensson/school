const express = require("express")
const userRoute = require("./routes/user");
const pageRoute = require("./routes/pages")
var exphbs  = require('express-handlebars');


const app = express();
const hbs = exphbs.create({ /* config */ });

app.use(express.json());
app.set('views', __dirname + '/views');
app.use('/js', express.static(__dirname + '/public/Js'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

app.use("/user", userRoute)
app.use("/", pageRoute)


app.get('/', function (req, res) {
    res.render('home');
});


app.listen(3000, () => {
    console.log("Server is up")
})

