const { validateForms } = require('../validators/validateUserForms');

const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
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

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'monserrate.oberbrunner21@ethereal.email',
            pass: 'VaNWfN9Vwwt7HD1DSw'
        }
    });

    // define email options
    let mailOptions = {
        from: 'AlloMedia.livraieon@media.com',
        to: req.body.email,
        subject: 'Account activation link',
        text: `Hello ${req.body.name},`,
        html: `<h1> Please click on the link to activate your account </h1>
        <a href="http://localhost:3000/api/auth/activate/${token}">Activate your account</a>`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return res.json({ token });

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
        res.status(400).send(err);
    }
}

module.exports = {
    register,
}