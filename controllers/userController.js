const { validateForms } = require('../validators/validateUserForms');
const sendMail = require('../helpers/sendMail');
const validateToken = require('../validators/validateToken');

const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register (req, res) {
    // Validate the data before we make a user
    const {error} = validateForms.validateRegister(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Checking if the user is already in the database
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({ error: 'Email already exists' });

    // Hash passwords
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    let payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    }

    // Create a new user
    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
    });
    try {
        const savedUser = await user.save();
        let userObject = { ...savedUser._doc };
        delete userObject.password;

        // generate a token with 600 seconds of expiration
        const token = jwt.sign(userObject, process.env.TOKEN_SECRET, { expiresIn: 600});
        sendMail(req.body, token); // send email to user

        res.json({ success: 'User registered successfully, verify your email ', user: userObject });
    } catch (err) {
        return res.status(400).send(err);
    }


}

async function activate (req, res) {
    // get token from url
    const token = req.params.token;
    if(!token) return res.status(401).json({ error: 'Access denied' });
    // verify token
    const decoded_user = validateToken(token);
    if(!decoded_user.success){
        return res.status(401).json({ error: 'Access denied' })
    }

    const _id = decoded_user.data._id;
    // update user
    try {
        const updatedUser = await UserModel.updateOne({ _id }, { is_verified: true });
        res.json({ success: 'Account activated successfully' });
    }catch (e) {
        console.log(e);
        res.status(400).json({ error: 'Something went wrong' });
    }

}

async function login(req, res){
    const {error} = validateForms.validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Checking if the user exists
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'Email is not found' });

    // Checking if the password is correct
    const validPass = await bcryptjs.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid password' });

    // checking if the user is verified
    if(!user.is_verified) return res.status(400).json({ error: 'Please verify your email' });

    // Create and assign a token
    const token = jwt.sign({ user}, process.env.TOKEN_SECRET);
    res.header('x-auth-token', token).json({ success: 'Logged in successfully', token: token });
}

module.exports = {
    register,
    activate,
    login
}