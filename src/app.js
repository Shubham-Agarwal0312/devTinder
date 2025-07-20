const express = require('express');
// const { adminAuth, userAuth } = require('./middlewares/auth');

const connectDb = require('./config/database');
const User = require('./models/user');


const app = express();

app.use(express.json())

app.get('/user', (req, res) => {
    res.send('get response properly');
});

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
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

