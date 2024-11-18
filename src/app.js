const express = require('express');

const app = express();

app.get('/user', (req, res, next) => {
    console.log('Request Handler 1');
    next();
    // res.send('Response 1');
}, (req, res, next) => {
    console.log('Request Handler 2');
    // res.send('Response 2');
    next();
    console.log('Request Handler 2.1');
    res.send('Response 2');
})

// app.get('/user/:id/:name/:age', (req, res) => {
//     console.log(req.query);
//     console.log(req.params);
//     res.send({
//         firstName: 'Shubham',
//         lastname: 'Agarwal'
//     });
// });

// app.get('/user', (req, res) => {
//     res.send({
//         firstName: 'Shubham',
//         lastname: 'Agarwal'
//     });
// });

// app.post('/user', (req, res) => {
//     res.send("User Data successfully added to the DB");
// });

// app.delete('/user', (req, res) => {
//     res.send("User Data successfully deleted from the DB");
// });

// app.use((req, res) => {
//     res.send('This is dashboard for devTinder');
// });

app.listen(3000, () => {
    console.log('server started successfully');
});