const validator = require('validator');

const validateUser = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error("first name or last name is not proper");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

module.exports = {validateUser};