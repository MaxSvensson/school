const {google} = require('googleapis'); 
const axios = require("axios")

let UserService = require("./UserService");
const { OAuth2Client } = require('googleapis-common');
UserService = new UserService();

class CalenderService {
    async getWeekEvents(id) {
        try {
            OAuthClient = new google.auth.OAuth2();

            OAuth2Client.setCredentials({
                access_token: user.accessToken
            })
            const user = await this.getUser(id)
            const calender = google.calendar({
                auth: user.accessToken,
                version: 'v3'
            })

            const response = await axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList?accesstoken=${user.accessToken}`)
            console.log(response)

        } catch (error) {
            
        }

    }
}


module.exports = CalenderService;