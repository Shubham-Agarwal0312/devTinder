const express = require('express');

const app = express();

app.use('/test', (req, res) => {
    res.send('This API is testing for devTinder');
});

app.use('/profile', (req, res) => {
    res.send('This API is user profile for devTinder!!');
});

app.use((req, res) => {
    res.send('This is dashboard for devTinder');
});

app.listen(3000, () => {
    console.log('server started successfully');
});