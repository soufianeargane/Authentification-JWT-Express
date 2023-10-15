const Role = require('./RoleModel');
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
    // role to reference the role model, and it must be required and exist in the role collection
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        validate: {
            validator: async function (v) {
                const role = await Role.findById(v);
                return role !== null;
            },
            message: 'Role does not exist',
        },
    }
}

const userSchema = new mongoose.Schema(schema);

// add a method to the userSchema to hide the password when returning a user

module.exports = mongoose.model('User', userSchema);