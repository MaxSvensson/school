const User = require("../DB/models/User");

class UserService {

    async getUser (id) {
        try {
            let user = User.findOne({googleId:id});
            return user;
        } catch (error) {
            return error;
        }
    }

    async setUserLogout (id) {
        try {
            let user = await User.findOne({googleId: id});
            user.currentlyLoggedIn = false
            await user.save()
            return user;
        } catch (error) {
            console.log(error)
            return error;
        } 

    }
}


module.exports = UserService;