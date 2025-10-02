const express = require('express');
const authRouter = express.Router();
const { validateUser } = require('../utils/validate');
const User = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
  try {
    validateUser(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send('user added successfully');
  } catch (err) {
    res.status(404).send('Something went wrong : ' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    let userList = await User.find({ emailId });
    if (!userList.length) {
      throw new Error('Email not exist in DB');
    }
    const user = userList[0];
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error('Password not matched');
    }
    const token = await user.getJWT();
    res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.send(user.firstName + ' logged in successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });

  res.send('successfully logout');
});

module.exports = authRouter;
