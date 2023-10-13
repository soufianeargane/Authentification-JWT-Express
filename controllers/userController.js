const { validateForms } = require('../validators/validateUserForms');
const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');

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