const Joi = require('joi');

// Register Validation
function validateRegister(body){
    const registerSchema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return registerSchema.validate(body);
}



// Login Validation
// const loginSchema = Joi.object({
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
// });

module.exports.validateForms ={
    validateRegister
};
