const User = require("../DB/models/User");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const { getCourseWork } = require("../OAuth");

class UserService {
  async getUser(id) {
    try {
      let user = User.findOne({ googleId: id });
      return user;
    } catch (error) {
      return error;
    }
  }

  async getUserById(id) {
    try {
      let user = User.findById(id);
      return user;
    } catch (error) {
      return error;
    }
  }

  async setUserLogout(id) {
    try {
      let user = await User.findOne({ googleId: id });
      user.currentlyLoggedIn = false;
      await user.save();
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getWeekEvents(id) {
    try {
      const user = await this.getUser(id);
      const calender = google.calendar({
        auth: user.accessToken,
        version: "v3",
      });
    } catch (error) {}
  }

  async CreateSessionToken(user) {
    const token = await jwt.sign(
      { id: user._id },
      "bF]%~P(}ReDqkDu'DhTB-Udp>H)/`z5b;-n/aP_qwJs<grm`SeXux%t(<Zx-de3{4"
    );
    return token;
  }

  async VerifySessionToken(token) {
    try {
      var decoded = await jwt.verify(
        token,
        "bF]%~P(}ReDqkDu'DhTB-Udp>H)/`z5b;-n/aP_qwJs<grm`SeXux%t(<Zx-de3{4"
      );
      if (!decoded) throw new Error("Token is invalid");
      return decoded.id;
    } catch (error) {
      return false;
    }
  }

  async planWeek() {
    const courseWork = await getCourseWork();
  }
}

const weekDays = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
};

module.exports = UserService;
