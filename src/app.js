const express = require('express');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/database');

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDb()
  .then(() => {
    console.log('DB is connected successfully');
    app.listen(7777, () => {
      console.log('server started successfully on port 7777');
    });
  })
  .catch(err => {
    console.error('connection not established error = ', err);
  })
  .finally(() => {
    console.log('final statement');
  });
