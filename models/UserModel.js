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
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    // role : {
    //     type: String,
    //     required: true,
    //     default: 'user',
    //
    // }
}

const userSchema = new mongoose.Schema(schema);

module.exports = mongoose.model('User', userSchema);