let UserService = require("../services/UserService");
UserService = new UserService();

const auth = async (req, res, next) => {
    try {
        if(!req.user) throw new Error();
        let user = await UserService.getUser(req.user.id);
        if(!user) return res.redirect("/logout")
        req.user = user;
        return next()
    } catch (error) {
        res.redirect("/login")
    }
}

module.exports = auth