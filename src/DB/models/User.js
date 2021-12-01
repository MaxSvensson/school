const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        trim:true,
        lowercase: true,
    },
    lastActive: mongoose.Schema.Types.Date,
    googleId: {
        type: String,
        required: true
    },
    tokens: {
        access_token : String,
        refresh_token : String,
        token_type : String,
        id_token : String,
        expiry_date : Number
    },
    currentlyLoggedIn: {
        type: Boolean,
        default: true,
    }
},{
    timestamps:true
})

// userSchema.methods.generateAuthToken = async function(){
//     const user = this;
//     const token = await jwt.sign({_id:user._id.toString(), type:'login'}, '#$#034283!_&_@$_&??+', {
//         expiresIn:'1d'
//     })

//     return token;
// }

const User = mongoose.model('User', userSchema)

module.exports = User;