const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://maxsvensson:<password>@cluster0.sipx2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    keepAlive: true,
})