let UserService = require("../services/UserService");
UserService = new UserService();

const auth = async (req, res, next) => {
    try {
        if(!req.cookies.token) throw new Error();
        const userId = await UserService.VerifySessionToken(req.cookies.token)
        if(!userId) throw new Error("No user was found 1")
        let user = await UserService.getUserById(userId);
        if(!user) throw new Error("No user was found 2")
        req.user = user;
        return next()
    } catch (error) {
        console.log(error.message)
        res.redirect("/login")
    }
}

module.exports = auth