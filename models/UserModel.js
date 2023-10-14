const mongoose = require('mongoose');

const schema = {
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
    },
    is_verified: {
        type: Boolean,
        default: false
    }
    ,
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
}

const userSchema = new mongoose.Schema(schema);

// add a method to the userSchema to hide the password when returning a user

module.exports = mongoose.model('User', userSchema);