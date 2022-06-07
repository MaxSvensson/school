const axios = require("axios");
const { google } = require("googleapis");
const { DateTime } = require("luxon");

// const setGoogleOAuthObject = (user) => {
//     oauth2Client.setCredentials(user.tokens);
// }

const getGoogleAuthURL = () => {
  const oauth2Client = new google.auth.OAuth2(
    "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/google/callback"
  );

  /*
   * Generate a url that asks permissions to the user's email and profile
   */
  const scopes = [
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.courses",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
    "https://www.googleapis.com/auth/classroom.announcements",
    "https://www.googleapis.com/auth/classroom.announcements.readonly",
  ];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes, // If you only need one scope you can pass it as string
  });
};

const getGoogleUser = async (code) => {
  const oauth2Client = new google.auth.OAuth2(
    "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/google/callback"
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // getCalendar(oauth2Client)

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });

  googleUser.tokens = tokens;

  return googleUser;
};

const getCoursesId = async (user) => {
  const oauth2Client = new google.auth.OAuth2(
    "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/google/callback"
  );

  oauth2Client.setCredentials(user.tokens);
  let classroom = google.classroom({
    version: "v1",
    auth: oauth2Client,
  });
};

// function getCourseWork(user) {

//   const oauth2Client = new google.auth.OAuth2(
//     "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
//     "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",
//     "http://localhost:3000/google/callback"
//   );

//   oauth2Client.setCredentials(user.tokens);
//   const classroom = google.classroom({version: 'v1', auth: oauth2Client});
//   const today = DateTime.now()

//   classroom.courses.list({
//     pageSize: 100,
//   }, async (err, res) => {
//     if (err) return console.error('The API returned an error: ' + err);

//     const courses = res.data.courses;

//     if (courses && courses.length) {
//       let Courses = [];
//         for (let i = 0; i < courses.length; i++) {
//           const course = courses[i];
//           // Fetch all coursework per course
//           (await classroom.courses.courseWork.list({ courseId: course.id })).data.courseWork.forEach(work => {
//             if(!work.dueDate) return;
//             const dueDate = DateTime.fromObject(work.dueDate)
//             if(today.startOf("day") <= dueDate.startOf("day")) {
//               Courses.push(work);
//             }
//           })
//         }
//         console.log(Courses)
//     } else {
//       console.log('No courses found.');
//     }
//   });
// let coursework = []
// console.log(ids)
// ids.forEach(async (id) => {

//   // })
// }

async function getCourseWork(user) {
  const oauth2Client = new google.auth.OAuth2(
    "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/google/callback"
  );

  oauth2Client.setCredentials(user.tokens);
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });
  const today = DateTime.now();

  try {
    const response = await classroom.courses.list({ pageSize: 100 });
    const courses = response.data.courses;

    const getAsyncCourseWork = async (course) => {
      try {
        let work = (
          await classroom.courses.courseWork.list({
            courseId: course.id,
            auth: oauth2Client,
          })
        ).data.courseWork;
        work = work.filter((workItem) => {
          if (workItem.dueDate) {
            const dueDate = DateTime.fromObject(workItem.dueDate);
            // console.log({today: today.startOf("day"), dueDate: dueDate.startOf("day")})
            if (
              today <= dueDate &&
              dueDate < DateTime.now().plus({ weeks: 1 })
            ) {
              // console.log(work)
              return workItem;
            }
          }
        });

        if (work.length < 0) return undefined;
        return work;
      } catch (error) {
        // console.log(error);
        return undefined;
      }
    };

    if (courses && courses.length) {
      let courseWork = await Promise.all(courses.map(getAsyncCourseWork));
      courseWork = courseWork?.filter((work) => work && work.length > 0);
      return courseWork.flat();
    }

    return [];
  } catch (error) {
    console.log(error);
  }
}

const getCourses = async () => {
  const oauth2Client = new google.auth.OAuth2(
    "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/google/callback"
  );

  oauth2Client.setCredentials(user.tokens);
  const classroom = google.classroom({ version: "v1", auth: oauth2Client });

  try {
    const response = await classroom.courses.list({ pageSize: 100 });
    const courses = response.data.courses;
    return courses;
  } catch (error) {
    console.log(errpr);
    return [];
  }
};

const insertEvent = async (user, config) => {
  const { id, end, start } = config;

  const oauth2Client = new google.auth.OAuth2(
    "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/google/callback"
  );

  oauth2Client.setCredentials(user.tokens);

  const calendarClient = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    const status = await calendarClient.events.insert({
      calendarId: id,
      sendNotifications: true,
      requestBody: {
        summary: "Uppgift plugga",
        end,
        start,
      },
    });

    console.log(status);
  } catch (error) {
    console.log(error);
  }
};

const getCalendar = async (user) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
      "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",
      "http://localhost:3000/google/callback"
    );

    oauth2Client.setCredentials(user.tokens);

    const calendarClient = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const data = await calendarClient.calendarList.list();

    console.log(data.data);

    return calendars;
  } catch (error) {
    return error;
  }
};

const createSchoolPlannerCalendar = async (user) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      "548185768048-sshoppdomogdd3knon71i8dg04c5vfeh.apps.googleusercontent.com",
      "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",
      "http://localhost:3000/google/callback"
    );

    oauth2Client.setCredentials(user.tokens);

    const calendarClient = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const calendarList = await calendarClient.calendarList.list({});
    const items = calendarList.data.items;

    const calendarExists = items.find(
      (calendar) => calendar.summary === "SchoolPlanner"
    );

    // console.log(calendarExists);

    if (calendarExists) {
      return calendarExists.id;
    }

    const response = await calendarClient.calendars.insert({
      resource: {
        summary: "SchoolPlanner",
      },
    });

    return response.data.id;

    // console.log(response);
  } catch (error) {
    throw new Error(error);
  }
};

// const getCalendarsId = async (user) => {
//     setGoogleOAuthObject(user)
//     try {
//         let calendar = google.calendar({version: 'v3', auth: oauth2Client});
//         const res = await calendar.calendarList.list();
//         let ids = []
//         res.data.items.forEach(item => {
//             ids.push(item.id);
//         })
//         return ids;
//     } catch (error) {
//         console.log(error)
//         return error
//     }
// }

// const getAllWeekEvents = async (user) => {
//     try {
//         let calendar = google.calendar({version: 'v3', auth: oauth2Client});
//         const ids = await getCalendarsId(user);
//         let events = [];
//         for (let index = 0; index < ids.length; index++) {
//             const calendarEvents = await (await calendar.events.list({ calendarId:ids[index] })).data.items;
//             events.push(...calendarEvents);
//         }
//         // events.flat()
//         console.log(events.length)
//         events.forEach(event => {
//             if(!event.start) return
//             const jsDate = new Date(event.start.dateTime ? event.start.dateTime : event.start.date)
//             const eventDate = DateTime.fromJSDate( jsDate );
//             const dateNow = DateTime.now()
//             if(eventDate >= dateNow) {
//                 // console.log(event)
//             }
//         })
//     } catch (error) {
//         // console.log(error)
//     }
// }

module.exports = {
  getGoogleAuthURL,
  getGoogleUser,
  // getAllWeekEvents,
  getCoursesId,
  getCourseWork,
  // getCalendarsId
  getCalendar,
  createSchoolPlannerCalendar,
  insertEvent,
};
