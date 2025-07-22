const express = require('express');
// const { adminAuth, userAuth } = require('./middlewares/auth');

const connectDb = require('./config/database');
const User = require('./models/user');


const app = express();

app.use(express.json())

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send('user added successfully');
    } catch(err) {
        res.send(404, 'Something went wrong');
    }
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

app.patch('/user', async (req, res) => {
    const userData = req.body;
    const emailId = userData.emailId;
    try {
        const oldUser = await User.findOneAndUpdate({"emailId": emailId}, userData, {returnDocument: "before"});
        console.log('oldUser = ', oldUser);
        res.send('User updated successfully');
    } catch(err) {
        res.send(404, 'Something went wrong');
    }

    // const userData = req.body;
    // const userId = userData.userId;
    // try {
    //     const oldUser = await User.findByIdAndUpdate(userId, userData, {returnDocument: "before"});
    //     console.log('oldUser = ', oldUser);
    //     res.send('User updated successfully');
    // } catch(err) {
    //     res.send(404, 'Something went wrong');
    // }
    
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

