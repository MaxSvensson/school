const User = require("../DB/models/User");
const {google} = require('googleapis'); 

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

    async getWeekEvents(id) {

        try {
            const user = await this.getUser(id)
            const calender = google.calendar({
                auth: user.accessToken,
                version: 'v3'
            })

            console.log(calender.acl.get())
        } catch (error) {
            
        }

    }
}


module.exports = UserService;