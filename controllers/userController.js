const { validateForms } = require('../validators/validateUserForms');
const sendMail = require('../helpers/sendMail');

const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register (req, res) {
    // Validate the data before we make a user
    const {error} = validateForms.validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    // Hash passwords
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    let payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    // generate a token with 600 seconds of expiration
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 600});

    // Create a new user
    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        let userObject = { ...savedUser._doc };
        delete userObject.password;

        res.json(userObject);
    } catch (err) {
        return res.status(400).send(err);
    }

    // send email
    sendMail(req.body, token);
}

async function login (req, res) {
    // get token from url
    const token = req.params.token;
    if(!token) return res.status(401).json({ error: 'Access denied' });
    // verify token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ error: 'Invalid token' });
        } else {
            res.json({ message: 'Token verified' });
        }
    });
}

module.exports = {
    register,
    login
}