const mongoose = require('mongoose');
const validator = require('validator');

const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
        
    },
    lastName: String,
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Provided email not valid');
            }
        }
    },
    password: {
        type: String,
        minLength: 8,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 120,
    },
    gender: {
        type: String,
        validate(value) {
            if (['male', 'female', 'others'].includes(value.toLowerCase())) {
                return true;
            } else {
                throw new Error("Gender data not valid");
            }
        }
    },
    photoURL: {
        type: String,
        default: "https://ongcvidesh.com/wp-content/uploads/2019/08/dummy-image.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Photo URL is not proper');
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about for the user!",
    },
    skills: {
        type: [String],
        default: ["JavaScript"],
    }
},
{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

