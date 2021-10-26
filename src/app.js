const express = require("express")
const userRoute = require("./routes/user");
var exphbs  = require('express-handlebars');


const app = express();
const hbs = exphbs.create({ /* config */ });


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

app.use("/user", userRoute)

app.get('/', function (req, res) {
    res.render('home');
});


app.listen(3000)

const app = express()

