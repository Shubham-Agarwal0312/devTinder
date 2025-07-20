const express = require('express');
// const { adminAuth, userAuth } = require('./middlewares/auth');

const connectDb = require('./config/database');
const User = require('./models/user');


const app = express();

// app.use(app.)

app.get('/user', (req, res) => {
    res.send('get response properly');
});

app.post('/signup', async (req, res) => {
    const userObj = {
        firstName: 'virat',
        lastName: 'kholi',
        emailId: 'virat@gmail.com',
        password: 'virat@123',
    }

    const user = new User(userObj);
    try {
        await user.save();
        res.send('user added successfully');
    } catch(err) {
        res.send(404, 'Something went wrong');
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

