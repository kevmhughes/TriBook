// reservation schema
const { Schema, model } = require("mongoose");

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15,
        match: /^[a-zA-Z0-9_-]+$/,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}/.test(value);
            },
            message: 'Password must be at least 8 characters long, including uppercase, lowercase, a number, and a special character.'
        }
    },
    email: {
        type: String,
        required: true,
        match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,  // Validates email format
    },
    userType: {
        type: String,
        enum: ["standard", "admin"],
        default: "standard"
    }
})

const User = model('User', userSchema);

module.exports = User;