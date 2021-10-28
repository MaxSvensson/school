const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://api:yx7voEDytpS0mvOO@cluster0.sipx2.mongodb.net/Cluster0?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    keepAlive: true,
}).then(() => console.log("Mongoose connected")).catch(e => console.log(e))