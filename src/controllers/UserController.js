
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("548185768048-lhm3f4gpepgeq4rv4v331n7aviiansb7");

class UserController {
    async verifyLoginToken(token) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: "548185768048-lhm3f4gpepgeq4rv4v331n7aviiansb7", 
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}


module.exports = UserController;