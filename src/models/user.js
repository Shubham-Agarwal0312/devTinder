const mongoose = require('mongoose');

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
    },
    password: {
        type: String,
        minLength: 4,
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

