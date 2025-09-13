const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');

const connectDb = require('./config/database');
const User = require('./models/user');
const {validateUser} = require('./utils/validate');


const app = express();

app.use(express.json())
app.use(cookieParser());

app.post('/signup', async (req, res) => {
    
    try {
        validateUser(req);
        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send('user added successfully');
    } catch(err) {
        res.status(404).send('Something went wrong : ' + err.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const userList = await User.find({emailId});
        if (!userList.length) {
            throw new Error("Email not exist in DB");
        }
        const user = userList[0];
        const isPasswordMatch = await user.validatePassword(password);
        if (!isPasswordMatch) {
            throw new Error("Password not matched");
        }
        const token = await user.getJWT();
        console.log('app token = ', token);
        res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
        res.send("logged in successfully");
        
    } catch(err) {
        res.status(400).send('Error: ' + err.message);
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send('Error: ' + err.message)
    }
    
})

app.get('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + ' send connection Request');
})

app.get('/user', async (req, res) => {
    const userEmailId = req.body.emailId;
    try {
        const user = await User.find({emailId: userEmailId});
        if (user.length > 0) {
            res.send(user);
        } else {
            res.send('user not found');
        }
    } catch(err) {
        res.send(404, 'something went wrong');
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length > 0) {
            res.send(users);
        } else {
            res.send('No user available');
        }
    } catch(err) {
        res.send(404, 'something went wrong');
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const doc = await User.findByIdAndDelete(userId);
        if (doc === null) {
            res.send('user not found');
        } else {
            res.send('User deleted successfully');
        }
        
    } catch(err) {
        res.send(404, 'Something went wrong');
    }
})

app.patch('/user/:userId', async (req, res) => {
    // const userData = req.body;
    // const emailId = userData.emailId;
    // try {
    //     const ALLOWED_UPDATE = ['photoURL', 'about', 'skills', 'age', 'gender'];
    //     const isUpdateAllow = Object.keys(userData).every((k) => ALLOWED_UPDATE.includes(k));
    //     if (!isUpdateAllow) {
    //         throw new Error('Given fieldes not allowed to update');
    //     }
    //     const oldUser = await User.findOneAndUpdate({"emailId": emailId}, userData, {returnDocument: "before", runValidators: true});
    //     console.log('oldUser = ', oldUser);
    //     res.send('User updated successfully');
    // } catch(err) {
    //     res.status(400).send('Update Failed: ' + err.message);
    // }

    const userData = req.body;
    const userId = req.params?.userId;
    try {
        if (userId === null) {
            throw new Error('Please provide the user id');
        }
        const ALLOWED_UPDATE = ['photoURL', 'about', 'skills', 'age', 'gender'];
        const isUpdateAllow = Object.keys(userData).every((k) => ALLOWED_UPDATE.includes(k));
        if (!isUpdateAllow) {
            throw new Error('Given fieldes not allowed to update');
        }
        if (userData.skills.length > 0) {
            throw new Error('skills should not more than 10');
        }
        const oldUser = await User.findByIdAndUpdate(userId, userData, {returnDocument: "before"});
        console.log('oldUser = ', oldUser);
        res.send('User updated successfully');
    } catch(err) {
        res.status(400).send('Update Failed: ' + err.message);
    }
    
})

connectDb().then(() => {
    console.log('DB is connected successfully');
    app.listen(7777, () => {
        console.log('server started successfully on port 7777');
    });
}).catch((err) => {
    console.error("connection not established error = ", err);
}).finally(() => {
    console.log('final statement');
})

