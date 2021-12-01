const { google } = require("googleapis");
const axios = require("axios");
const { DateTime } = require("luxon");


const oauth2Client = new google.auth.OAuth2(
  "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/google/callback"
);


const getGoogleAuthURL = () => {
    /*
     * Generate a url that asks permissions to the user's email and profile
     */
    const scopes = ['email', 'profile', 'https://www.googleapis.com/auth/calendar.events.readonly', 'https://www.googleapis.com/auth/calendar.readonly']

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes, // If you only need one scope you can pass it as string
    });
}


const getGoogleUser = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // getCalendar(oauth2Client)
  
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        },
      )
      .then(res => res.data)
      .catch(error => {
        throw new Error(error.message);
      });

    googleUser.tokens = tokens
  
    return googleUser;
}

const setGoogleOAuthObject = (user) => {
    oauth2Client.setCredentials(user.tokens);
}

const getCoursesId = async () => {
    let classroom = google.classroom({version: 'v3', auth: oauth2Client})
}

const getCalendarsId = async (user) => {
    setGoogleOAuthObject(user)
    try {
        let calendar = google.calendar({version: 'v3', auth: oauth2Client});
        const res = await calendar.calendarList.list();
        let ids = []
        res.data.items.forEach(item => {
            ids.push(item.id);
        })
        return ids;
    } catch (error) {
        console.log(error)
        return error
    }
}

const getAllWeekEvents = async (user) => {
    try {
        let calendar = google.calendar({version: 'v3', auth: oauth2Client});
        const ids = await getCalendarsId(user);
        console.log(ids)
        let events = [];
        for (let index = 0; index < ids.length; index++) {
            const calendarEvents = await (await calendar.events.list({ calendarId:ids[index] })).data.items;
            events.push(...calendarEvents);
        }
        // events.flat()
        console.log(events.length)
        events.forEach(event => {
            if(!event.start) return
            const jsDate = new Date(event.start.dateTime ? event.start.dateTime : event.start.date)
            const eventDate = DateTime.fromJSDate( jsDate );
            const dateNow = DateTime.now()
            if(eventDate >= dateNow) {
                // console.log(event)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getGoogleAuthURL,
    getGoogleUser,
    getAllWeekEvents
}