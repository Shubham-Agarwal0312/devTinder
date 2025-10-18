const express = require('express');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/database');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

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
