const Joi = require("@hapi/joi");
//Function used for validation register data
const registerValidation = (data) => {
    const register = Joi.object({
        FirstName: Joi.string().min(6).max(255).required(),
        LastName: Joi.string().min(6).max(255).required(),
        Email: Joi.string().min(6).max(255).email().required(),
        Password: Joi.string().min(6).max(255).required(),
        ConfirmPassword: Joi.any().valid(Joi.ref("Password")).required(),
    });

    return register.validate(data);
};
//Function used for validation login data
const loginValidation = (data) => {
    const login = Joi.object({
        Email: Joi.string().min(6).max(255).email().required(),
        Password: Joi.string().min(6).max(255).required(),
    });
    return login.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
