const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.send(401, 'Please Login!!');
    }

    const decodedObj = await jwt.verify(token, 'Shubham@1994');
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('user not found');
    }
    req.user = user;
    next();
  } catch (err) {
    res.send(404, 'err: ' + err.message);
  }
};

module.exports = { userAuth };
