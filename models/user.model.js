// reservation schema
const { Schema, model } = require("mongoose");

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["standard", "admin"],
        default: "standard"
    }
})

const User = model('User', userSchema);

module.exports = User;