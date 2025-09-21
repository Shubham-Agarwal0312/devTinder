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

const validateEditFields = (req) => {
    const requestedEditFields = req.body;
    const possibleEditFields = ['firstName', 'lastName', 'age', 'about', 'gender', 'photoURL', 'skills'];

    const isValid = Object.keys(requestedEditFields).every((key) => possibleEditFields.includes(key));

    if (!isValid) {
        throw new Error('Edit Fields are not valid');
    }
}

module.exports = {validateUser, validateEditFields};